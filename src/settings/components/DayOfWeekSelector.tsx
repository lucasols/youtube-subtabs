import React from 'react';
import styled from '@emotion/styled';
import { colorPrimary, fontSecondary } from 'style/theme';
import { rgba } from '@lucasols/utils';
import { css } from '@emotion/core';

type Props = {
  days: number[];
  onChange: (days: Props['days']) => any;
  className?: string;
};

const Container = styled.div`
  margin-top: 24px;
  width: 100%;

  h1 {
    font-family: ${fontSecondary};
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 12px;
    letter-spacing: 0.0125em;
  }
`;

const DaysContainer = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(8, auto);
  gap: 8px;
`;

const Day = styled.button`
  border: 1.5px solid ${rgba(colorPrimary, 0.7)};
  border-radius: 100px;
  font-size: 12px;
  /* text-transform: uppercase; */
  font-weight: 300;
  text-align: center;
  padding: 4px 0;
  color: #fff;
  transition: 160ms;

  &:hover {
    border-color: ${colorPrimary};
  }
`;

const dayIsActiveStyle = css`
  background: ${rgba(colorPrimary, 0.7)};
  border-color: transparent;

  &:hover {
    background: ${colorPrimary};
  }
`;

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DayOfWeekSelector = ({ days, onChange, className }: Props) => {
  const allIsSelected = days.length === 7;

  function onClickDay(day: 'all' | number) {
    if (day === 'all') {
      onChange(allIsSelected ? [] : [0, 1, 2, 3, 4, 5, 6]);
    } else {
      onChange(
        days.includes(day) ? days.filter(item => item !== day) : [...days, day],
      );
    }
  }

  return (
    <Container className={className}>
      <h1>Days of week</h1>
      <DaysContainer>
        <Day
          css={allIsSelected && dayIsActiveStyle}
          onClick={() => onClickDay('all')}
        >
          All
        </Day>
        {daysOfWeek.map((item, i) => (
          <Day
            css={days.includes(i) && dayIsActiveStyle}
            key={item}
            onClick={() => onClickDay(i)}
          >
            {item}
          </Day>
        ))}
      </DaysContainer>
    </Container>
  );
};

export default DayOfWeekSelector;
