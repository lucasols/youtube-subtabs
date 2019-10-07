import css from '@emotion/css';
import styled from '@emotion/styled';
import Icon, { Icons } from 'components/Icon';
import React, { FunctionComponent } from 'react';
import { letterSpacing } from 'style/helpers';
import { centerContent, fillContainer } from 'style/modifiers';
import { colorPrimary, colorGradient } from 'style/theme';

type Props = {
  label?: string;
  onClick?: (e?: React.MouseEvent) => any;
  className?: string;
  href?: string;
  noNewTab?: boolean;
  icon?: Icons;
  bgColor?: string;
  iconSize?: number;
  small?: boolean;
  disabled?: boolean;
};

const Container = styled.a<{ as?: string; disabled?: boolean }>`
  ${centerContent};
  position: relative;
  padding: 0 24px;
  height: 36px;
  margin: 4px;
  display: inline-flex;
  font-weight: 400;
  cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
  opacity: ${p => (p.disabled ? 0.5 : 1)};
  transition: 240ms;
  text-transform: uppercase;
  font-size: 14px;
  color: #fff;

  &::before {
    ${fillContainer};
    content: '';
    background: ${colorGradient()};
    opacity: 0.85;
    transition: 160ms;
    border-radius: 12px;
  }

  &:hover::before {
    opacity: ${p => (p.disabled ? 0.85 : 1)};
  }
`;

const Label = styled.span`
  z-index: 1;
  ${letterSpacing(12)};
`;

const smallStyle = css`
  height: 24px;
  padding: 0 16px;
  font-size: 12px;

  &::before {
    border-radius: 8px;
  }
`;

const Button = ({
  label,
  onClick,
  className,
  href,
  icon,
  disabled,
  noNewTab,
  iconSize,
  small,
}: Props) => (
  <Container
    className={className}
    as={!href ? 'button' : undefined}
    type={!href ? 'button' : undefined}
    href={href}
    onClick={onClick}
    disabled={disabled}
    css={small && smallStyle}
    target={!href || noNewTab ? undefined : '_blank'}
  >
    {icon && (
      <Icon
        size={iconSize}
        css={label && { marginRight: 16 }}
        name={icon}
        color={colorPrimary}
      />
    )}
    {label && <Label>{label}</Label>}
  </Container>
);

export default Button;
