import React from 'react';
import { obj as anyObj } from 'src/typings/utils';
/* eslint-disable no-undef */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

export type NestableItemBaseProps<T extends anyObj, I = number | 'all'> = {
  id: I;
  name: string;
  children?: NestableItemBaseProps<T>[];
} & T;

export type NestableProps<T> = {
  items: NestableItemBaseProps<T>[];
  threshold?: number;
  maxDepth?: number;
  collapsed?: boolean;
  className?: string;
  group?: string | number;
  handler?: JSX.Element;
  childrenProp?: string;
  renderItem?: ({
    item,
    index,
    handler,
    collapseIcon,
    maxDepth,
    onClick,
  }: {
    item: NestableItemBaseProps<T>;
    index: number;
    handler: JSX.Element;
    collapseIcon: JSX.Element;
    maxDepth: number;
    onClick: NonNullable<NestableProps<T>['onClick']>;
  }) => JSX.Element;
  renderCollapseIcon?: ({
    isCollapsed,
  }: {
    isCollapsed: boolean;
  }) => JSX.Element;
  onChange?: (items: NestableItemBaseProps<T>[], item: NestableItemBaseProps<T>) => any;
  confirmChange?: (
    dragItem: NestableItemBaseProps<T>,
    destinationParent: NestableItemBaseProps<T> | null,
    ) => boolean;
  onClick?: (item: NestableItemBaseProps<T>) => any;
};

declare class Nestable<T> extends React.Component<NestableProps<T>> {
  collapse(value: 'ALL' | 'NONE'): void;
}

export default Nestable;
