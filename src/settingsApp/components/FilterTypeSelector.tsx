import React from 'react';
import styled from '@emotion/styled';
import { FilterProps } from 'settingsApp/state/filtersState';
import { fontSecondary, colorPrimary, colorSecondary } from 'settingsApp/style/theme';
import { centerContent } from 'settingsApp/style/modifiers';
import { css } from '@emotion/core';
import { rgba } from '@lucasols/utils';

type Props = {
  selected: FilterProps['type'] | null;
  onChange: (type: Props['selected']) => any;
};

const Container = styled.div`
  ${centerContent};
  margin-top: 12px;
  margin-bottom: 8px;

  h1 {
    font-family: ${fontSecondary};
    font-size: 14px;
    font-weight: 300;
    opacity: 0.5;
    letter-spacing: 0.0125em;
  }
`;

const OptionsWrapper = styled.div`
  padding: 4px;
  border-radius: 200px;
  transition: 160ms;
  cursor: pointer;
  background: ${colorSecondary};
  margin-left: 8px;

  &:hover {
    background: ${colorSecondary};
  }
`;

const Option = styled.button`
  border: 1.5px solid transparent;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  padding: 2px 6px;
  transition: 160ms;
  letter-spacing: 0.04em;
`;

const selectedOptionStyle = css`
  background: ${rgba(colorPrimary, 1)};
`;

const FilterTypeSelector = ({ selected, onChange }: Props) => {
  function onclick() {
    onChange(selected === 'include' ? 'exclude' : 'include');
  }

  return (
    <Container>
      <h1>Type:</h1>
      <OptionsWrapper onClick={onclick}>
        <Option css={selected === 'include' && selectedOptionStyle}>
          Include
        </Option>
        <Option
          css={[
            selected === 'exclude' && selectedOptionStyle,
            { marginLeft: 4 },
          ]}
        >
          Exclude
        </Option>
      </OptionsWrapper>
    </Container>
  );
};

export default FilterTypeSelector;
