import React, { useRef, useEffect, useMemo } from 'react';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderButton from 'settingsApp/components/HeaderButton';
import HeaderStyle, { HeaderRight } from 'settingsApp/components/HeaderStyle';
import { EditPageContainer } from 'settingsApp/containers/EditTab';
import appState from 'settingsApp/state/appState';
import TextField, { TextFieldRef } from 'settingsApp/components/TextField';
import styled from '@emotion/styled';
import FiltersList from 'settingsApp/components/CardList';
import filtersState, { addFilter } from 'settingsApp/state/filtersState';
import { useDebounce, rgba } from '@lucasols/utils';
import { checkIfFieldsMatchesItem, getSearchFields } from 'utils/search';
import { colorSecondary, colorGreen } from 'settingsApp/style/theme';

const Header = styled(HeaderStyle)`
  grid-template-columns: 1fr auto;
`;

const AddBasedOnSearchButton = styled.button`
  margin-bottom: 20px;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  color: #fff;
  /* width: 100%; */
  border: 1.5px solid ${rgba(colorGreen, 0.4)};
  opacity: 0.8;
  transition: opacity 160ms;

  &:hover {
    opacity: 1;
  }
`;

const Search = () => {
  const [query, setQuery] = appState.useStore('search');
  const [filters] = filtersState.useStore('filters');
  const show = query !== null;
  const inputRef = useRef<TextFieldRef>(null);

  useEffect(() => {
    if (show === true) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [show]);

  const debouncedQuery = useDebounce(query, 500);
  const searchResult = useMemo(() => {
    const searchFields = getSearchFields(debouncedQuery ?? '');

    return {
      filters: searchFields
        ? filters
          .map(item => ({
            ...item,
            ...checkIfFieldsMatchesItem(searchFields, item),
          }))
          .filter(item => item.matches)
        : [],
      fields: searchFields,
    };
  }, [debouncedQuery, filters]);

  function addFilterBasedOnQuery() {
    // const searchFields = getSearchFields(debouncedQuery ?? '');

    if (searchResult.fields) {
      const { name, tabs, type, userId, videoName } = searchResult.fields;

      addFilter({
        name,
        tabs,
        userId,
        videoNameRegex: videoName,
        type: type === 'include' || type === 'exclude' ? type : undefined,
      });
    }
  }

  return (
    <EditPageContainer
      css={{
        visibility: show ? 'visible' : 'hidden',
        opacity: show ? 1 : 0,
        transform: `scale(${show ? 1 : 1.1})`,
      }}
    >
      <ContentWrapper>
        <Header>
          <TextField
            ref={inputRef}
            value={query ?? ''}
            label="Search"
            css={{ gridColumn: '1' }}
            handleChange={newValue => setQuery(`${newValue}`)}
            usePlaceholder
          />
          <HeaderButton
            onClick={() => setQuery(null)}
            css={{ marginLeft: 8, alignSelf: 'center' }}
            icon="close"
          />
        </Header>
        <FiltersList items={searchResult.filters} disableSort search />
        {searchResult.fields &&
          (searchResult.fields.name
            || searchResult.fields.userName
            || searchResult.fields.tabs
            || searchResult.fields.userId
            || searchResult.fields.videoName
            || searchResult.fields.type) && (
            <AddBasedOnSearchButton onClick={addFilterBasedOnQuery}>
              Add based on search
            </AddBasedOnSearchButton>
        )}
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default Search;
