import styled from '@emotion/styled';
import Icon from 'settingsApp/components/Icon';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import React from 'react';
import appState from 'settingsApp/state/appState';
import { ExclusiveFilterProps } from 'settingsApp/state/filtersState';
import { addTab, ExclusiveTabProps } from 'settingsApp/state/tabsState';
import { circle } from 'settingsApp/style/helpers';
import { centerContent } from 'settingsApp/style/modifiers';
import { colorBg, colorSecondary } from 'settingsApp/style/theme';

type Props = {
  item: NestableItemBaseProps<
    Partial<ExclusiveFilterProps> &
      Partial<ExclusiveTabProps> & { error?: string }
  >;
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
  handler,
  collapseIcon,
  maxDepth,
  onClick,
}: Props) => (
  <Card title={item.isInvalid}>
    {handler}
    {collapseIcon}
    <ListLabel onClick={() => onClick(item)}>
      <span>{item.tabs
        ? item.name || (item.userId || item.videoNameRegex ? `${item.userId ? `user: "${item.userId}"` : ''} ${item.videoNameRegex ? `video: "${item.videoNameRegex}"` : ''}` : 'Invalid Filter')
        : `${item.name} ${item.id === 'all' ? '🌐' : ''}`}</span>{' '}
      {item.isInvalid && <Icon name="warn" size={16} css={{ marginLeft: 4 }} />}
    </ListLabel>
    {item.id !== 'all' && item.parent === null && maxDepth > 1 && (
      <IconButton onClick={() => addTab(item.id as number)}>
        <Icon name="add" size={20} />
      </IconButton>
    )}
    {item.id !== 'all' && (
      <IconButton
        onClick={() =>
          (item.tabs
            ? appState.setKey('filterToDelete', item.id as number)
            : appState.setKey('tabToDelete', item.id as number))}
      >
        <Icon name="delete" size={20} />
      </IconButton>
    )}
  </Card>
);

export default CardListItem;
