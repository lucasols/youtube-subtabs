import css from '@emotion/css';
import styled from '@emotion/styled';
import Icon, { Icons } from 'settingsApp/components/Icon';
import React, { FunctionComponent } from 'react';
import { letterSpacing } from 'settingsApp/style/helpers';
import { centerContent, fillContainer } from 'settingsApp/style/modifiers';
import { colorPrimary, colorGradient } from 'settingsApp/style/theme';

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
  z-index: 0;
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
    background: ${colorPrimary};
    opacity: 0.85;
    transition: 160ms;
    z-index: -1;
    border-radius: 1000px;
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
  font-size: 11px;
`;

const iconOnlyStyle = css`
  padding: 4px;
  height: auto;
`;

const Button = ({
  label,
  onClick,
  className,
  href,
  icon,
  disabled,
  noNewTab,
  iconSize = 16,
  small,
}: Props) => (
  <Container
    className={className}
    as={!href ? 'button' : undefined}
    type={!href ? 'button' : undefined}
    href={href}
    onClick={onClick}
    disabled={disabled}
    css={[small && smallStyle, icon && !label && iconOnlyStyle]}
    target={!href || noNewTab ? undefined : '_blank'}
  >
    {icon && (
      <Icon
        size={iconSize}
        css={[
          label && {
            marginRight: small ? 4 : 16,
            marginLeft: small ? -5 : undefined,
          },
          icon && !label && {
            margin: 0,
          },
        ]}
        name={icon}
        color="#fff"
      />
    )}
    {label && <Label>{label}</Label>}
  </Container>
);

export default Button;
