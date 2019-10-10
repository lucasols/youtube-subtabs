import React from 'react';
import styled from '@emotion/styled';
import { colorPrimary, colorBg } from 'src/react/style/theme';

type Props = {
  on: boolean;
  className?: string;
};

const switchHeigth = 18;
const switchWidth = 36;
const knobDiameter = 12;
const borderSize = 1;
const knobMargin = (switchHeigth - borderSize * 2 - knobDiameter) / 2;

const Container = styled.div`
  position: relative;

  width: ${switchWidth}px;
  height: ${switchHeigth}px;

  border-radius: 50px;
  border: 1px solid ${colorPrimary};
  opacity: 0.6;

  transition: 240ms;
`;

const Knob = styled.div`
  position: absolute;
  width: ${knobDiameter}px;
  height: ${knobDiameter}px;

  background-color: ${colorPrimary};
  border-radius: 100px;
  top: ${knobMargin}px;
  left: ${knobMargin}px;

  transform: translate3d(0, 0, 0);

  transition: 240ms ease-out;
`;

const knobShit = switchWidth - borderSize * 2 - knobDiameter - knobMargin * 2;

const Switch = ({ on, className }: Props) => (
  <Container
    className={className}
    css={
      on && {
        backgroundColor: colorPrimary,
        opacity: 1,
      }
    }
  >
    <Knob
      css={
        on && {
          transform: `translate3d(${knobShit}px,0,0)`,
          backgroundColor: colorBg,
        }
      }
    />
  </Container>
);

export default Switch;
