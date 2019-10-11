import styled from '@emotion/styled';
import Button from 'settingsApp/components/Button';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle from 'settingsApp/components/HeaderStyle';
import Icon from 'settingsApp/components/Icon';
import { CloseButton, EditPageContainer, tabNameInputClassname } from 'settingsApp/containers/EditTab';
import { debounce, filter } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import { PartialKey } from 'src/typings/utils';
import appState from 'settingsApp/state/appState';
import tabsState, { changeTabName, TabProps } from 'settingsApp/state/tabsState';
import { centerContent } from 'settingsApp/style/modifiers';
import filtersState, { FilterProps, ExclusiveFilterProps } from 'settingsApp/state/filtersState';
import TextField from 'settingsApp/components/TextField';
import { getUniqueId } from 'utils/getUniqueId';
import DayOfWeekSelector from 'settingsApp/components/DayOfWeekSelector';
import FilterTypeSelector from 'settingsApp/components/FilterTypeSelector';
import { colorError } from 'settingsApp/style/theme';

// IDEA: edit tab parent on edit tab page

const Row = styled.div`
  ${centerContent};
  width: 100%;
  margin-top: 24px;
  justify-content: space-between;
`;

type EditFilterProps = Omit<ExclusiveFilterProps, 'userRegex' | 'videoNameRegex' | 'tab' | 'type'> & {
  name: string;
  tab: ExclusiveFilterProps['tab'];
  type: ExclusiveFilterProps['type'];
  textFields: {
    userRegex: { value: string, isValid: boolean };
    videoNameRegex: { value: string, isValid: boolean };
  }
};

const regexValidator = {
  errorMsg: 'Regex is invalid',
  validator: (value: string) => {
    try {
      new RegExp(value);
      return true
    } catch(e) {
      return false;
    }
  },
};

function stringify<T>(value: T) {
  return JSON.stringify(value);
};

const EditFilter = () => {
  const [editFilter, setEditFilter] = appState.useStore('editFilter');
  const [editTab] = appState.useStore('editTab');
  const [newFilterProps, setNewFilterProps] = useState<EditFilterProps>();
  const [filters] = filtersState.useStore('filters');

  const selectedFilter = filtersState.getState().filters.find((item: typeof filters[0]) => item.id === editFilter);
  const filterTab = tabsState.getState().tabs.find((item) => item.id === (selectedFilter?.tab ?? editTab));

  const show = !!selectedFilter;

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;

    if (!newFilterProps) return;

    setNewFilterProps({
      ...newFilterProps,
      name: newName,
    });
  }

  function checkIfIsValid() {
    if (!newFilterProps) return false;

    if (!(newFilterProps.name !== ''
      && newFilterProps.textFields.userRegex.isValid
      && newFilterProps.textFields.videoNameRegex.isValid
      && newFilterProps.type !== null
      && newFilterProps.tab !== null
    )) {
      console.error('invalid props');
      return false;
    };

    type DiffCheckObject = {
      name: string;
      userRegex: string | null;
      videoNameRegex: string | null;
      daysOfWeek: number[];
      type: "include" | "exclude";
    };

    if (
      selectedFilter
      && stringify<DiffCheckObject>({
        name: newFilterProps.name,
        userRegex: newFilterProps.textFields.userRegex.value,
        videoNameRegex: newFilterProps.textFields.videoNameRegex.value,
        daysOfWeek: newFilterProps.daysOfWeek.sort((a, b) => a - b),
        type: newFilterProps.type,
      }) === stringify<DiffCheckObject>({
        name: selectedFilter.name,
        userRegex: selectedFilter.userRegex,
        videoNameRegex: selectedFilter.videoNameRegex,
        daysOfWeek: selectedFilter.daysOfWeek.sort((a, b) => a - b),
        type: selectedFilter.type,
      })
    ) {
      console.error('new props is equal to saved');
      return false;
    };

    if (
      !newFilterProps.textFields.userRegex.value && !newFilterProps.textFields.videoNameRegex.value
    ) {
      console.error('at least one filte must be defined');
      return false;
    };

    return true;
  }

  function onSaveFilter() {
    if (!newFilterProps || !checkIfIsValid() || !newFilterProps.tab || !newFilterProps.type) {
      return
    };

    const newProps: FilterProps = {
      id: selectedFilter?.id ?? getUniqueId(filtersState.getState().filters),
      daysOfWeek: newFilterProps.daysOfWeek,
      name: newFilterProps.name,
      tab: newFilterProps.tab,
      type: newFilterProps.type,
      userRegex: newFilterProps.textFields.userRegex.value,
      videoNameRegex: newFilterProps.textFields.videoNameRegex.value,
    };

    filtersState.dispatch('updateFilters', [
      newProps
    ]);

    setEditFilter(null);
  }

  function handleTextFieldsChange(
    value: string | number,
    isValid: boolean,
    fieldId: keyof EditFilterProps['textFields'],
  ) {
    if (!newFilterProps) return;

    setNewFilterProps({
      ...newFilterProps,
      textFields: {
        ...newFilterProps.textFields,
        [fieldId]: { value, isValid },
      }
    });
  }

  function onDayOfWeekChange(daysOfWeek: number[]) {
    if (!newFilterProps) return;

    setNewFilterProps({
      ...newFilterProps,
      daysOfWeek,
    });
  }

  function onTypeChange(type: FilterProps['type']) {
    if (!newFilterProps) return;

    setNewFilterProps({
      ...newFilterProps,
      type,
    });
  }

  useEffect(() => {
    if (!editTab) return;

    if (selectedFilter) {
      setNewFilterProps({
        name: selectedFilter.name,
        textFields: {
          userRegex: { value: selectedFilter.userRegex, isValid: true },
          videoNameRegex: { value: selectedFilter.videoNameRegex, isValid: true }
        },
        daysOfWeek: selectedFilter.daysOfWeek,
        tab: selectedFilter.tab,
        type: selectedFilter.type,
      });
    } else {
      console.error('error on set filter props');
    }
  }, [selectedFilter?.id]);

  return (
    <EditPageContainer
      css={{
        visibility: show ? 'visible' : 'hidden',
        opacity: show ? 1 : 0,
        transform: `scale(${show ? 1 : 1.1})`,
      }}
    >
      <CloseButton onClick={() => setEditFilter(null)}>
        <Icon name="close" />
      </CloseButton>
      <ContentWrapper>
        <HeaderStyle>
          Filter {'· '}
          <span>{filterTab?.name}</span>{' · '}
          <AutosizeInput
            type="text"
            inputClassName={tabNameInputClassname}
            onChange={onChangeName}
            placeholder="Filter Name"
            value={newFilterProps?.name}
          />
        </HeaderStyle>

        <FilterTypeSelector
          selected={newFilterProps?.type ?? null}
          onChange={onTypeChange}
        />

        <TextField
          value={newFilterProps?.textFields.userRegex?.value ?? ''}
          id="userRegex"
          label="User Regex"
          css={{ marginTop: 24 }}
          handleChange={handleTextFieldsChange}
          disableLabelAnimation
          validations={[regexValidator]}
        />

        <TextField
          value={newFilterProps?.textFields.videoNameRegex?.value ?? ''}
          id="videoNameRegex"
          label="Video Name Regex"
          css={{ marginTop: 24 }}
          handleChange={handleTextFieldsChange}
          disableLabelAnimation
          validations={[regexValidator]}
        />

        <DayOfWeekSelector
          days={newFilterProps?.daysOfWeek ?? []}
          onChange={onDayOfWeekChange}
        />

        {!newFilterProps?.textFields.userRegex.value && !newFilterProps?.textFields.videoNameRegex.value &&
          <Row css={{ color: colorError, fontSize: 12, marginBottom: -24 }}>
            Error: At least one of the regex fields must me defined!
          </Row>
        }
        <Row
          css={{
            marginTop: 40,
            paddingBottom: 24,
            position: 'sticky',
            bottom: 0,
          }}
        >
          <Button label="Delete" small onClick={() => {
            if (selectedFilter?.id) {
              appState.setKey('filterToDelete', selectedFilter.id);
            }
          }}/>
          <Button label="Cancel" small css={{ marginLeft: 'auto' }} onClick={() => setEditFilter(null)} />
          <Button
            key={selectedFilter?.id}
            label="Save filter"
            disabled={!checkIfIsValid()}
            small
            onClick={onSaveFilter}
          />
        </Row>
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default EditFilter;
