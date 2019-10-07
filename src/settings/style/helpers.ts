import css from '@emotion/css';

export function rectSize(size: number) {
  return css`
    width: ${size}px;
    height: ${size}px;
  `;
}

export function circle(size: number) {
  return css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${size}px;
  `;
}

/**
 *
 * @param emSize size in em unit
 */
export function letterSpacing(percentage: number) {
  return css`
    letter-spacing: ${percentage / 100}em;
    margin-right: -${percentage / 100}em;
  `;
}
