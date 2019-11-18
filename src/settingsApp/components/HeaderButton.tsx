import React from 'react';
import styled from '@emotion/styled';
import { circle } from 'settingsApp/style/helpers';
import { centerContent } from 'settingsApp/style/modifiers';
import { colorSecondary } from 'settingsApp/style/theme';
import Icon, { Icons } from 'settingsApp/components/Icon';

type Props = {
  icon: Icons;
  onClick?: () => any;
  className?: string;
};

const Container = styled.button`
  ${circle(32)};
  ${centerContent};

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

const HeaderButton = ({ icon, onClick, className }: Props) => (
  <Container onClick={onClick} className={className}>
    <Icon size={icon === 'search' ? 18 : undefined} name={icon} />
  </Container>
);

export default HeaderButton;
