import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import Button from 'settingsApp/components/Button';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import DayOfWeekSelector from 'settingsApp/components/DayOfWeekSelector';
import FilterTypeSelector from 'settingsApp/components/FilterTypeSelector';
import HeaderStyle, {
  HeaderContent,
  HeaderLeft,
  HeaderRight,
} from 'settingsApp/components/HeaderStyle';
import Icon from 'settingsApp/components/Icon';
import TabSelector from 'settingsApp/components/TabSelector';
import TextField from 'settingsApp/components/TextField';
import {
  EditPageContainer,
  tabNameInputClassname,
} from 'settingsApp/containers/EditTab';
import HeaderButton from 'settingsApp/components/HeaderButton';
import appState from 'settingsApp/state/appState';
import filtersState, {
  ExclusiveFilterProps,
  FilterProps,
} from 'settingsApp/state/filtersState';
import { centerContent } from 'settingsApp/style/modifiers';
import { colorBg, colorError } from 'settingsApp/style/theme';
import { getUniqueId } from 'utils/getUniqueId';

const Row = styled.div`
  ${centerContent};
  width: 100%;
  margin-top: 24px;
  justify-content: space-between;
`;

type EditFilterProps = Omit<
  ExclusiveFilterProps,
  'userId' | 'videoNameRegex' | 'userName' | 'tab' | 'type'
> & {
  name: string;
  tabs: ExclusiveFilterProps['tabs'];
  type: ExclusiveFilterProps['type'];
  textFields: {
    userRegex: { value: string; isValid: boolean };
    userNameRegex: { value: string; isValid: boolean };
    videoNameRegex: { value: string; isValid: boolean };
  };
};

const regexValidator = {
  errorMsg: 'Regex is invalid',
  validator: (value: string) => {
    try {
      // eslint-disable-next-line no-new
      new RegExp(value);
      return true;
    } catch (e) {
      return false;
    }
  },
};

function stringify<T>(value: T) {
  return JSON.stringify(value);
}

const EditFilter = () => {
  const [editFilter, setEditFilter] = appState.useStore('editFilter');
  const [newFilterProps, setNewFilterProps] = useState<EditFilterProps>();
  const [filters] = filtersState.useStore('filters');

  const selectedFilter = filters.find((item: typeof filters[0]) => item.id === editFilter);

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

    if (
      !(
        newFilterProps.textFields.userRegex.isValid &&
        newFilterProps.textFields.userNameRegex.isValid &&
        newFilterProps.textFields.videoNameRegex.isValid
      )
    ) {
      console.log('invalid props');
      return false;
    }

    type DiffCheckObject = {
      name: string;
      userRegex: string | null;
      userNameRegex: string | null;
      videoNameRegex: string | null;
      daysOfWeek: number[];
      tabs: FilterProps['tabs'];
      type: 'include' | 'exclude';
    };

    if (
      selectedFilter &&
      stringify<DiffCheckObject>({
        name: newFilterProps.name,
        tabs: newFilterProps.tabs,
        userRegex: newFilterProps.textFields.userRegex.value,
        userNameRegex: newFilterProps.textFields.userNameRegex.value,
        videoNameRegex: newFilterProps.textFields.videoNameRegex.value,
        daysOfWeek: newFilterProps.daysOfWeek.sort((a, b) => a - b),
        type: newFilterProps.type,
      })
        === stringify<DiffCheckObject>({
          name: selectedFilter.name,
          tabs: selectedFilter.tabs,
          userRegex: selectedFilter.userId,
          userNameRegex: selectedFilter.userName,
          videoNameRegex: selectedFilter.videoNameRegex,
          daysOfWeek: selectedFilter.daysOfWeek.sort((a, b) => a - b),
          type: selectedFilter.type,
        })
    ) {
      console.log('new props is equal to saved');
      return false;
    }

    if (
      !newFilterProps.textFields.userRegex.value &&
      !newFilterProps.textFields.userNameRegex.value &&
      !newFilterProps.textFields.videoNameRegex.value
    ) {
      console.log('at least one filte must be defined');
      return false;
    }

    return true;
  }

  function onSaveFilter() {
    if (!newFilterProps || !checkIfIsValid() || !newFilterProps.type) {
      return;
    }

    const newProps: FilterProps = {
      id: selectedFilter?.id ?? getUniqueId(filtersState.getState().filters),
      daysOfWeek: newFilterProps.daysOfWeek,
      name: newFilterProps.name,
      tabs: newFilterProps.tabs,
      type: newFilterProps.type,
      userId: newFilterProps.textFields.userRegex.value.replace(
        /https:\/\/www.youtube.com\/(user|channel)\//,
        '',
      ),
      userName: newFilterProps.textFields.userNameRegex.value,
      videoNameRegex: newFilterProps.textFields.videoNameRegex.value,
    };

    filtersState.dispatch('updateFilters', [newProps]);

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
      },
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

  function onTabsChange(tabs: FilterProps['tabs']) {
    if (!newFilterProps) return;

    setNewFilterProps({
      ...newFilterProps,
      tabs,
    });
  }

  useEffect(() => {
    if (selectedFilter) {
      setNewFilterProps({
        name: selectedFilter.name,
        textFields: {
          userRegex: { value: selectedFilter.userId, isValid: true },
          videoNameRegex: {
            value: selectedFilter.videoNameRegex,
            isValid: true,
          },
          userNameRegex: {
            value: selectedFilter.userName,
            isValid: true,
          },
        },
        daysOfWeek: selectedFilter.daysOfWeek,
        tabs: selectedFilter.tabs,
        type: selectedFilter.type,
      });
    } else {
      console.log('error on set filter props');
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
      <ContentWrapper>
        <HeaderStyle>
          <HeaderLeft>
            <HeaderButton onClick={() => setEditFilter(null)} icon="chevron-left" />
          </HeaderLeft>
          <HeaderContent>
            Filter ·
            <AutosizeInput
              type="text"
              inputClassName={tabNameInputClassname}
              onChange={onChangeName}
              placeholder="Filter Name"
              value={newFilterProps?.name}
            />
          </HeaderContent>
        </HeaderStyle>

        <FilterTypeSelector
          selected={newFilterProps?.type ?? null}
          onChange={onTypeChange}
        />

        <TabSelector
          selectedTabsId={newFilterProps?.tabs ?? []}
          onChange={onTabsChange}
        />

        <TextField
          value={newFilterProps?.textFields.userNameRegex.value ?? ''}
          id="userNameRegex"
          label="User Name"
          css={{ marginTop: 24 }}
          handleChange={handleTextFieldsChange}
          disableLabelAnimation
        />

        <TextField
          value={newFilterProps?.textFields.userRegex.value ?? ''}
          id="userRegex"
          label="User ID"
          css={{ marginTop: 24 }}
          handleChange={handleTextFieldsChange}
          disableLabelAnimation
          validations={[regexValidator]}
        />

        <TextField
          value={newFilterProps?.textFields.videoNameRegex.value ?? ''}
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

        {!newFilterProps?.textFields.userRegex.value &&
          !newFilterProps?.textFields.userNameRegex.value &&
          !newFilterProps?.textFields.videoNameRegex.value && (
            <Row css={{ color: colorError, fontSize: 12, marginBottom: -24 }}>
              Error: At least one of the regex fields must me defined!
            </Row>
        )}
        <Row
          css={{
            marginTop: 40,
            paddingBottom: 24,
            position: 'sticky',
            bottom: 0,
            zIndex: 20,
            background: colorBg,
          }}
        >
          <Button
            label="Delete"
            small
            onClick={() => {
              if (selectedFilter?.id) {
                appState.setKey('filterToDelete', selectedFilter.id);
              }
            }}
          />
          <Button
            label="Cancel"
            small
            css={{ marginLeft: 'auto' }}
            onClick={() => setEditFilter(null)}
          />
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
