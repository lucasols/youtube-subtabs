import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import React, { ChangeEvent, useRef, useState } from 'react';
import Button from 'settingsApp/components/Button';
import Icon from 'settingsApp/components/Icon';
import Modal from 'settingsApp/components/Modal';
import filtersState, { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import { circle } from 'settingsApp/style/helpers';
import { centerContent, centerContentCollum, hide, show } from 'settingsApp/style/modifiers';
import { colorBg, colorError, colorSecondary } from 'settingsApp/style/theme';

const MenuButton = styled.button`
  ${centerContent};
  position: fixed;
  top: 16px;
  right: 16px;
  ${circle(32)};

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    ${circle(32)};
    background: ${colorSecondary};
    opacity: 0;
    transition: 160ms;
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

const Options = styled.div`
  ${hide};
  position: fixed;
  top: ${16 + 32}px;
  right: 16px;
  background: ${colorSecondary};
  padding: 4px 0;
  border-radius: 4px;
  transition: 160ms;
`;

const Option = styled.button`
  ${centerContentCollum};
  font-size: 12px;
  padding: 8px 12px;
  color: #fff;
  transition: 160ms;

  &:hover {
    background: ${rgba(colorBg, 0.6)};
  }
`;

const ImportDataModal = styled(Modal)`
  width: 240px;
  font-size: 12px;
`;

const ImportDataInfo = styled.div`
  margin-top: 16px;
  width: 100%;
  line-height: 1.3;
  white-space: pre-line;
`;

function download(
  content: BlobPart,
  fileName: string,
  contentType: BlobPropertyBag['type'],
) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

type ImportData = {
  tabs: Omit<TabProps, 'children' | 'isInvalid'>[];
  filters: Omit<FilterProps, 'children' | 'isInvalid'>[];
}

const ImportDataValidator: t.Type<ImportData, ImportData> = t.type({
  tabs: t.array(t.type({
    id: t.union([t.number, t.literal('all')]),
    name: t.string,
    includeChildsFilter: t.boolean,
    parent: t.union([t.null, t.union([t.number, t.literal('all')])]),
  })),
  filters: t.array(t.type({
    id: t.number,
    name: t.string,
    type: t.union([t.literal('include'), t.literal('exclude')]),
    userRegex: t.string,
    tab: t.union([t.number, t.literal('all')]),
    videoNameRegex: t.string,
    daysOfWeek: t.array(t.number),
  })),
});

const ExportImportMenu = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<ImportData>();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');

  function onClickExport() {
    const today = new Date().toISOString().slice(0, 10);

    download(
      JSON.stringify(
        {
          tabs: tabsState.getState().tabs,
          filters: filtersState.getState().filters,
        },
        undefined,
        2,
      ),
      `subTabs-data-${today}.json`,
      'text/plain',
    );
  }

  function confirmImport() {
    if (!importInputRef) return;

    if (importData) {
      tabsState.setKey('tabs', importData.tabs);
      filtersState.setKey('filters', importData.filters);

      setShowImportDialog(false);
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const contents = readerEvent.target?.result;

      if (typeof contents === 'string') {
        const data = JSON.parse(contents);

        const result = ImportDataValidator.decode(data);

        pipe(
          result,
          fold(() => {
            setImportError(reporter<ImportData>(ImportDataValidator.decode(data)).join('\n'));
            setImportData(undefined);
          }, (value) => {
            setImportData(value);
            setImportError('');
          })
        );
      }
    };

    reader.readAsText(file);
  }

  const importInfo = importData
    ? `Tabs (${importData.tabs.length}): ${(importData.tabs.length > 20 ? [...importData.tabs.slice(0, 20), { name: '...' }] : importData.tabs).map(tab => tab.name).join(', ')}
      Filters: ${importData.filters.length}`
    : importError;

  return (
    <>
      <MenuButton onClick={() => setShowOptions(!showOptions)}>
        <Icon name="more-vert" />
      </MenuButton>
      <Options css={showOptions && show}>
        <Option onClick={onClickExport}>Export app data</Option>
        <Option onClick={() => setShowImportDialog(true)}>
          Import app data
        </Option>
      </Options>
      <ImportDataModal
        title="Import data"
        show={showImportDialog}
        onClose={() => setShowImportDialog(false)}
      >
        <input type="file" css={{ width: '100%' }} ref={importInputRef} onChange={onFileChange} />
        <ImportDataInfo css={{ color: !importData ? colorError : undefined }}>
          {importInfo}
        </ImportDataInfo>
        <div css={[centerContent, { width: '100%', marginTop: 16 }]}>
          <Button
            label="Cancel"
            small
            onClick={() => setShowImportDialog(false)}
          />
          <Button
            label="Import"
            small
            disabled={!importData}
            css={{ marginLeft: 'auto' }}
            onClick={confirmImport}
          />
        </div>
      </ImportDataModal>
    </>
  );
};

export default ExportImportMenu;
