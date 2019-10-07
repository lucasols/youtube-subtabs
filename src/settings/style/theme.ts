import { rgba } from '@lucasols/utils';
import css from '@emotion/css';

/* colors hex */
export const colorPrimary = '#FF1744';
export const colorSecondary = '#2B2934';
export const colorBg = '#222029';
export const colorError = '#DA1E28';
export const colorWarning = '#FDD13A';

/* gradients */
export const colorGradient = (
  alpha = 1,
  deg = 45,
) => `linear-gradient(${deg}deg, ${rgba('#027C7A', alpha)} 0%, ${rgba(
  '#38B762',
  alpha,
)} 100%);
`;

export const textGradient = css`
  color: ${colorPrimary};

  @supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
    background: ${colorGradient()};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

/* fonts */
export const fontPrimary = 'Open Sans, sans-serif';
export const fontDecorative = 'Roboto Condensed, sans-serif';
export const fontSecondary = 'Source Sans Pro, sans-serif';

export const easeInOut = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
