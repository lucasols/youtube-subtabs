import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { show as showStyleModifier, centerContent, hide, fillContainer } from 'style/modifiers';
import css from '@emotion/css';
import { colorBg, textGradient, colorSecondary } from 'style/theme';
import { rgba } from '@lucasols/utils';
import Button from 'components/Button';
import { rectSize } from 'style/helpers';

type Props = {
  show: boolean;
  className?: string;
  title?: string;
  onClose?: () => void;
};

const modalRoot = document.getElementById('modals') as HTMLDivElement;

const ModalWrapper = styled.div`
  ${hide};
  ${centerContent};
  position: fixed;
  top: 0;
  width: 0;
  width: 100%;
  height: 100%;
  transition: 240ms;
`;

const ModalCard = styled.div`
  position: absolute;
  width: 100%;
  top: 160px;
  max-width: 540px;
  max-height: calc(100% - 32px * 2);
  /* margin: 32px 0; */
  overflow-y: auto;
  padding: 16px;
  font-size: 14px;
  border-radius: 12px;
  background: ${colorSecondary};
`;

const Bg = styled.div`
  ${fillContainer};
  background: ${rgba(colorBg, 0.2)};
  backdrop-filter: blur(10px);
`;

const ModalTitle = styled.h1`
  width: 100%;
  padding-right: 40px;
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
`;

const closeButtonStyle = css`
  position: absolute;
  ${rectSize(40)};
  padding: 0;
  margin: 0;
  right: 4px;
  top: 4px;
  &::before {
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    opacity: 0;
    width: 32px;
    height: 32px;
  }
  &:hover::before {
    opacity: 0.08;
  }
`;

const Modal: FunctionComponent<Props> = ({
  children,
  show,
  className,
  title,
  onClose,
}) => {
  const root = useRef<HTMLElement>();

  function getRoot() {
    if (!root.current) {
      root.current = document.createElement('div');
    }

    return root.current;
  }

  useEffect(() => {
    modalRoot.appendChild(getRoot());

    return () => {
      modalRoot.removeChild(getRoot());
    };
  }, []);

  return ReactDOM.createPortal(
    <ModalWrapper css={show && showStyleModifier}>
      <Bg onClick={onClose} />
      <ModalCard className={className}>
        {title && <ModalTitle>{title}</ModalTitle>}
        {onClose && (
          <Button icon="close" css={closeButtonStyle} iconSize={32} onClick={onClose} />
        )}
        {children}
      </ModalCard>
    </ModalWrapper>,
    getRoot(),
  );
};

export default Modal;
