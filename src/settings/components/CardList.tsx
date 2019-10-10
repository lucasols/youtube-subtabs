import css from '@emotion/css';
import { rgba } from '@lucasols/utils';
import CardListItem, { CollapseIcon, Handler } from 'components/CardListItem';
import Nestable, { NestableItemBaseProps } from 'lib/react-nestable';
import React, { useRef, useEffect } from 'react';
import { colorPrimary, colorSecondary } from 'style/theme';
import { anyObj } from '@lucasols/utils/dist/typings/utils';

type Props<T extends anyObj> = {
  items: NestableItemBaseProps<T>[];
  maxDepth: number;
  confirmChange?: (
    dragItem: NestableItemBaseProps<T>,
    destinationParent: NestableItemBaseProps<T> | null,
  ) => boolean;
  onClick: (item: NestableItemBaseProps<T>) => any;
  setItems: (items: NestableItemBaseProps<T>[]) => any;
  collapse?: 'ALL' | 'NONE';
};

const styleWrapper = css`
  margin-top: 8px;
  margin-bottom: 20px;
  position: relative;
  width: 100%;

  .nestable-list {
    margin: 0;
    padding: 0 0 0 20px;
    list-style-type: none;
  }

  .nestable-item {
    position: relative;
  }

  > .nestable-list {
    padding: 0;
  }

  .nestable-item,
  .nestable-item-copy {
    margin: 8px 0 0;
  }

  .nestable-item:first-child,
  .nestable-item-copy:first-child {
    margin-top: 0;
  }

  .nestable-item .nestable-list,
  .nestable-item-copy .nestable-list {
    margin-top: 10px;
  }

  .nestable-item.is-dragging .nestable-list {
    pointer-events: none;
  }

  .nestable-item.is-dragging * {
    opacity: 0;
  }

  .nestable-item.is-dragging:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${rgba(colorSecondary, 0.4)};
    border: 1px dashed ${colorPrimary};
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }

  .nestable-item-icon {
    margin-right: 5px;
    cursor: pointer;
  }

  .nestable-drag-layer {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
  }

  .nestable-drag-layer > .nestable-list {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
  }
`;

function CardList<T extends anyObj = {}>({ items, setItems, confirmChange, maxDepth, onClick, collapse }: Props<T>) {
  const nestableRef = useRef<Nestable<T>>(null);

  function onChange(newItems: NestableItemBaseProps<T>[]) {
    setItems(newItems);
  }

  useEffect(() => {
    if (collapse) nestableRef.current?.collapse(collapse);
  }, [collapse]);

  return (
    <Nestable<T>
      css={styleWrapper}
      items={items}
      onChange={onChange}
      onClick={onClick}
      maxDepth={maxDepth}
      confirmChange={confirmChange}
      renderCollapseIcon={CollapseIcon}
      renderItem={CardListItem}
      handler={Handler}
      ref={nestableRef}
    />
  );
}

export default CardList;
