import React, { useRef, useEffect, useMemo } from 'react';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderButton from 'settingsApp/components/HeaderButton';
import HeaderStyle, { HeaderRight } from 'settingsApp/components/HeaderStyle';
import { EditPageContainer } from 'settingsApp/containers/EditTab';
import appState from 'settingsApp/state/appState';
import TextField, { TextFieldRef } from 'settingsApp/components/TextField';
import styled from '@emotion/styled';
import FiltersList from 'settingsApp/components/CardList';
import filtersState from 'settingsApp/state/filtersState';
import { useDebounce } from '@lucasols/utils';
import { checkIfFieldsMatchesItem, getSearchFields } from 'utils/search';

// show filtering debug
// add page routing based on hash
// add new filter duplicating props

const Header = styled(HeaderStyle)`
  grid-template-columns: 1fr auto;
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

  const searchFields = useDebounce(getSearchFields(query ?? ''), 500);
  const searchResult = useMemo(
    () =>
      (searchFields
        ? filters.filter(item => checkIfFieldsMatchesItem(searchFields, item).matches)
        : []),
    [JSON.stringify(searchFields)],
  );

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
        <FiltersList items={searchResult} disableSort />
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default Search;
