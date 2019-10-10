import styled from '@emotion/styled';
import Icon from 'components/Icon';
import { NestableItemBaseProps } from 'lib/react-nestable';
import React from 'react';
import appState from 'state/appState';
import { ExclusiveFilterProps } from 'state/filtersState';
import { addTab, ExclusiveTabProps } from 'state/tabsState';
import { circle } from 'style/helpers';
import { centerContent } from 'style/modifiers';
import { colorBg, colorSecondary } from 'style/theme';

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

function checkIfIsInvalid(item: Props['item']) {
  if (item.tab) {
    if (item.videoNameRegex === '' && item.userRegex === '') {
      return 'Invalid regex';
    }
  } else {
    // tab item
    // const tabFilters = filters.filter(filter => filter.tab === item.id);
    // if (item.parent !== null) {
    //   if (tabFilters.length === 0) {
    //     return 'This child tab has no filters';
    //   }
    //   return undefined;
    // }
    // if (
    //   tabFilters.some(
    //     filter => filter.videoNameRegex === '' && filter.userRegex === '',
    //   )
    // ) {
    //   return 'This tab has no valid filters';
    // }
    // const tabChilds = tabsState
    //   .getState()
    //   .tabs.filter(child => child.parent === item.id);
    // // 1. se ele for pai e não tiver filhos e nehhum filtro
    // if (item.id !== 'all' && tabChilds.length === 0 && tabFilters.length === 0) {
    //   return 'This tab has no filters';
    // }
    // // 2. se ele for pai e algum dos filtros do seu filho for invalido
    // if (
    //   tabChilds.some(tabChild => {
    //     const tabChildFilters = filters.filter(filter => filter.tab === tabChild.id);
    //     if (tabChildFilters.length === 0) {
    //       return 'Some child of this tab has no filters';
    //     }
    //     return tabChildFilters.some(
    //       filter => filter.videoNameRegex === '' && filter.userRegex === '',
    //     );
    //   })
    // ) {
    //   return 'Some child of this tab has no valid filters';
    // }
  }

  return undefined;
}

const CardListItem = ({
  item,
  index,
  handler,
  collapseIcon,
  maxDepth,
  onClick,
}: Props) => {
  // const [filters] = filtersState.useStore('filters');
  const isInvalid = checkIfIsInvalid(item);

  return (
    <Card title={isInvalid}>
      {handler}
      {collapseIcon}
      <ListLabel onClick={() => onClick(item)}>
        <span>{item.name}</span>{' '}
        {isInvalid && <Icon name="warn" size={16} css={{ marginLeft: 4 }} />}
      </ListLabel>
      {item.id !== 'all' && item.parent === null && maxDepth > 1 && (
        <IconButton onClick={() => addTab(item.id as number)}>
          <Icon name="add" size={20} />
        </IconButton>
      )}
      {item.id !== 'all' && (
        <IconButton
          onClick={() =>
            (item.tab
              ? appState.setKey('filterToDelete', item.id as number)
              : appState.setKey('tabToDelete', item.id as number))
          }
        >
          <Icon name="delete" size={20} />
        </IconButton>
      )}
    </Card>
  );
};

export default CardListItem;
