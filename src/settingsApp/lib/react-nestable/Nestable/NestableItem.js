/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class NestableItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.any.isRequired,
    }),
    isCopy: PropTypes.bool,
    options: PropTypes.object,
    index: PropTypes.number,
    onClick: PropTypes.func,
  };

  render() {
    const { item, isCopy, options, index, maxDepth, onClick } = this.props;
    const {
      dragItem,
      renderItem,
      handler,
      childrenProp,
      renderCollapseIcon,
    } = options;
    const isCollapsed = options.isCollapsed(item);

    const isDragging = !isCopy && dragItem && dragItem.id === item.id;
    const hasChildren = item[childrenProp] && item[childrenProp].length > 0;

    let Handler;

    const itemProps = {
      className: cn(
        `nestable-item${isCopy ? '-copy' : ''}`,
        `nestable-item${isCopy ? '-copy' : ''}-${item.id}`,
        {
          'is-dragging': isDragging,
        },
      ),
    };

    let rowProps = {};
    let handlerProps = {};
    if (!isCopy) {
      if (dragItem) {
        rowProps = {
          ...rowProps,
          onMouseEnter: e => options.onMouseEnter(e, item),
        };
      } else {
        handlerProps = {
          ...handlerProps,
          draggable: true,
          onDragStart: e => options.onDragStart(e, item),
        };
      }
    }

    if (handler) {
      Handler = React.cloneElement(handler, handlerProps);
    } else {
      rowProps = {
        ...rowProps,
        ...handlerProps,
      };
    }

    const collapseIcon =
      hasChildren && renderCollapseIcon
        ? React.cloneElement(renderCollapseIcon({ isCollapsed }), {
          onClick: () => options.onToggleCollapse(item),
        })
        : null;

    return (
      <li {...itemProps}>
        <div className="nestable-item-name" {...rowProps}>
          {renderItem({
            item,
            collapseIcon,
            handler: Handler,
            index,
            maxDepth,
            onClick,
          })}
        </div>

        {hasChildren && !isCollapsed && (
          <ol className="nestable-list">
            {item[childrenProp].map((item, i) => (
              <NestableItem
                key={i}
                index={i}
                item={item}
                options={options}
                isCopy={isCopy}
                onClick={onClick}
              />
            ))}
          </ol>
        )}
      </li>
    );
  }
}

export default NestableItem;
