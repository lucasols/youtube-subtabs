import React from 'react';
import styled from '@emotion/styled';
import { colorSecondary, colorBg } from 'style/theme';
import css from '@emotion/css';
import Icon from 'components/Icon';
import { centerContent } from 'style/modifiers';
import { circle } from 'style/helpers';
import { NestableItemBaseProps } from 'lib/react-nestable';
import appState from 'state/appState';

type Props = {
  item: NestableItemBaseProps<{}>;
  index: number;
  maxDepth: number;
  handler?: JSX.Element;
  collapseIcon?: JSX.Element;
  onClick: (item: NestableItemBaseProps<{}>) => any;
};

const Card = styled.div`
  background: ${colorSecondary};
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  ${centerContent};
`;

const ListLabel = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  cursor: pointer;
`;

const HandlerContainer = styled.button`
  padding: 0 4px;
  height: 100%;
  cursor: grab;
  transition: 160ms;
  opacity: 0.1;

  &:hover {
    opacity: 0.4 !important;
  }
`;

const IconButton = styled.button`
  ${centerContent};
  height: 100%;
  width: 32px;
  margin-right: 4px;
  z-index: 0;
  opacity: 0;
  transition: 160ms;

  ${Card}:hover & {
    opacity: 1;
  }

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    ${circle(32)};
    background: ${colorBg};
    opacity: 0;
    transition: 160ms;
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

const CollapseIconContainer = styled.button`
  ${centerContent};
  height: 100%;
  width: 24px;
  margin-left: -4px;
  margin-right: 4px;

  &::before {
    content: '';
    position: absolute;
    ${circle(24)};
    background: ${colorBg};
    opacity: 0;
    transition: 160ms;
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

export const Handler = (
  <HandlerContainer type="button">
    <Icon name="drag-handler" size={20} color="#fff" />
  </HandlerContainer>
);

export const CollapseIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <CollapseIconContainer type="button">
    <Icon
      name="chevron-down"
      css={{
        transition: '160ms',
        transform: `rotate(${isCollapsed ? 0 : 180}deg)`,
      }}
    />
  </CollapseIconContainer>
);

const CardListItem = ({
  item,
  index,
  handler,
  collapseIcon,
  maxDepth,
  onClick,
}: Props) => (
  <Card>
    {handler}
    {collapseIcon}
    <ListLabel onClick={() => onClick(item)}>
      <span>{item.name}</span>
    </ListLabel>
    {item.id !== 'all' && item.parent === null && maxDepth > 1 && (
      <IconButton
        onClick={() => appState.dispatch('addSubtab', { parent: item.id as number })}
      >
        <Icon name="add" size={20} />
      </IconButton>
    )}
    {item.id !== 'all' && (
      <IconButton
        onClick={() => appState.setKey('tabToDelete', item.id as number)}
      >
        <Icon name="delete" size={20} />
      </IconButton>
    )}
  </Card>
);

export default CardListItem;
