import { JsonIcon } from 'components/Icon';

const iconSet = {
  delete: {
    viewBox: '0 0 32 32',
    paths: [
      'M12 12H14V24H12V12ZM18 12H20V24H18V12Z',
      'M4 6V8H6V28C6 28.5304 6.21071 29.0391 6.58579 29.4142C6.96086 29.7893 7.46957 30 8 30H24C24.5304 30 25.0391 29.7893 25.4142 29.4142C25.7893 29.0391 26 28.5304 26 28V8H28V6H4ZM8 28V8H24V28H8ZM12 2H20V4H12V2Z',
    ],
  },
  add: {
    viewBox: '0 0 32 32',
    paths: ['M17 15V7H15V15H7V17H15V25H17V17H25V15H17Z'],
  },
  'drag-handler': {
    viewBox: '0 0 32 32',
    paths: [
      'M14 5H10V9H14V5zM22 5H18V9H22V5zM14 14H10V18H14V14zM22 14H18V18H22V14zM14 23H10V27H14V23zM22 23H18V27H22V23z',
    ],
  },
  edit: {
    viewBox: '0 0 32 32',
    paths: [
      'M30 27H2V29H30V27zM25.41 8.99999C25.596 8.81425 25.7435 8.59367 25.8441 8.35087 25.9448 8.10808 25.9966 7.84782 25.9966 7.58499 25.9966 7.32216 25.9448 7.06191 25.8441 6.81911 25.7435 6.57631 25.596 6.35574 25.41 6.16999L21.83 2.58999C21.6443 2.40404 21.4237 2.25652 21.1809 2.15587 20.9381 2.05522 20.6778 2.00342 20.415 2.00342 20.1522 2.00342 19.8919 2.05522 19.6491 2.15587 19.4063 2.25652 19.1857 2.40404 19 2.58999L4 17.59V24H10.41L25.41 8.99999zM20.41 3.99999L24 7.58999 21 10.59 17.41 6.99999 20.41 3.99999zM6 22V18.41L16 8.40999 19.59 12 9.59 22H6z',
    ],
  },
  close: {
    viewBox: '0 0 32 32',
    paths: [
      'M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z',
    ],
  },
  'chevron-down': {
    viewBox: '0 0 32 32',
    paths: ['M16 20.4L9 13.4L10.4 12L16 17.6L21.6 12L23 13.4L16 20.4Z'],
  },
};

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testIconTypes: {
    [k: string]: JsonIcon;
  } = iconSet;
}

export default iconSet;
