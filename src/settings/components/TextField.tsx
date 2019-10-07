import React, {
  useState,
  useRef,
  ChangeEvent,
  FunctionComponent,
  useEffect,
} from 'react';
import styled from '@emotion/styled';
import { ellipsis } from 'polished';
import css from '@emotion/css';
import {
  fontSecondary,
  colorBg,
  colorPrimary,
  colorSecondary,
  colorRed,
} from 'style/theme';
import AutoGrow from 'textarea-autogrow';
import { show, hide } from 'style/modifiers';
import { debounce } from 'lodash-es';

export type HandleChange = (
  value: string | number,
  isValid: boolean,
  id?: string,
) => void;

type Props = {
  label?: string;
  handleChange: HandleChange;
  handleIsValidChange?: (isValid: boolean, id?: string) => void;
  value: string | number;
  validations?: {
    regex?: RegExp;
    showErrorIfMatch?: boolean;
    errorMsg: string;
    validator?: (value: string) => boolean;
  }[];
  id?: string;
  width?: string;
  multiline?: boolean;
  disableLabelAnimation?: boolean;
  required?: boolean;
  hideErrors?: boolean;
  usePlaceholder?: boolean;
  maxlength?: number;
  additionalLeftPadding?: number;
  className?: string;
  background?: string;
  autocomplete?: string;
  max?: number;
  lines?: number;
  step?: number;
  min?: number;
  type?: 'number' | 'text' | 'date' | 'password' | 'email';
  timeout?: number;
  forceRequiredErrorMsg?: boolean;
  requiredErrorMsg?: string;
  minErrorMsg?: string;
  maxErrorMsg?: string;
};

const Container = styled.div`
  width: 140px;

  * {
    transition: 160ms;
  }
`;

const labelOnTop = css`
  font-size: 14px;
  top: -7px;
  left: 10px;
`;

const Label = styled.label<{ notEmpty: boolean }>`
  position: absolute;
  top: 12px;
  left: 9px;
  padding: 0 6px;
  height: 18px;

  font-size: 16px;
  font-family: ${fontSecondary};
  letter-spacing: 0.0125em;
  color: ${colorPrimary};

  ${ellipsis()};
  pointer-events: none;

  ${p => p.notEmpty && labelOnTop};

  input:focus + & {
    ${labelOnTop};

    color: #333;
  }
`;

const inputStyle = css`
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 42px;
  min-height: 42px;
  padding-top: 12px;
  padding-right: 12px;
  padding-bottom: 8px;
  padding-left: 12px;

  color: #333;
  font-size: 16px;
  letter-spacing: 0.0125em;
  background: transparent;

  border-radius: 8px;
  border: 1.5px solid ${colorPrimary};
  outline: none;

  &:focus {
    border: 1.5px solid ${colorSecondary};
  }
`;

const TextArea = styled.textarea`
  ${inputStyle};
  /* overflow: hidden; */
  width: calc(100% - 12px * 2 - 3px);
  min-width: calc(100% - 12px * 2 - 3px);
  max-width: calc(100% - 12px * 2 - 3px);
  resize: none;
  box-sizing: content-box;
`;

const ValidationError = styled.div`
  ${hide};
  font-size: 10px;
  font-weight: 500;
  margin-bottom: 12px;
  color: ${colorRed};
  letter-spacing: 0.0125em;
`;

const TextField: FunctionComponent<Props> = ({
  label,
  max,
  id,
  min,
  step,
  value = '',
  required,
  validations,
  handleChange,
  maxlength,
  multiline,
  hideErrors,
  disableLabelAnimation,
  forceRequiredErrorMsg,
  background = colorBg,
  width = '100%',
  type = 'text',
  autocomplete,
  className = 'text-field-container',
  usePlaceholder = false,
  requiredErrorMsg = `This field can't be blank!`,
  minErrorMsg = 'The value must be higher than',
  maxErrorMsg = 'The value must be less than',
}) => {
  const [isValid, setIsValid] = useState(true);
  const [displayError, setDisplayError] = useState<string[]>([]);
  const inputId = useRef(`${Date.now() + Math.random()}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // const debouncedHandleChange = debounce<HandleChange>((...args) => {
  //   handleChange(...args);
  // }, 1000);

  function checkIfIsValid(inputValue: string | number) {
    const inputLenght = `${inputValue}`.trim().length;
    let fieldIsValid = true;
    let errorMsg: typeof displayError = [];

    if (required && inputLenght === 0) {
      fieldIsValid = false;
      errorMsg = [requiredErrorMsg];
    } else if (max && inputLenght > max) {
      fieldIsValid = false;
      errorMsg = [maxErrorMsg];
    } else if (min && inputLenght < min) {
      fieldIsValid = false;
      errorMsg = [minErrorMsg];
    } else if (validations) {
      errorMsg = validations
        .filter(item => {
          const matched = item.regex
            ? item.regex.test(`${inputValue}`)
            : item.validator && item.validator(`${inputValue}`);

          return item.showErrorIfMatch ? matched : !matched;
        })
        .map(elem => elem.errorMsg);

      fieldIsValid = errorMsg.length === 0;
    }

    setDisplayError(errorMsg);
    setIsValid(fieldIsValid);

    return fieldIsValid;
  }

  function updateValue(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { value: inputValue } = event.target;
    const parsedInputValue =
      type === 'number' ? parseFloat(inputValue) : inputValue;
    const newValueIsValid = checkIfIsValid(parsedInputValue);

    handleChange(parsedInputValue, newValueIsValid, id);
  }

  useEffect(() => {
    if (multiline) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const growingTextarea = new AutoGrow(textareaRef.current, 5);
    }
  }, []);

  const errors = [
    ...displayError,
    ...(forceRequiredErrorMsg && !displayError.includes(requiredErrorMsg)
      ? [requiredErrorMsg]
      : []),
  ];

  const inputProps = {
    type,
    max,
    min,
    step,
    id: inputId.current,
    value,
    autoComplete: autocomplete,
    onBlur: updateValue,
    onChange: updateValue,
    maxLength: maxlength,
    placeholder: usePlaceholder && label ? label : undefined,
  };

  return (
    <Container css={{ width }} className={className}>
      <div css={{ position: 'relative', zIndex: 5 }}>
        {!multiline ? (
          <input css={inputStyle} {...inputProps} />
        ) : (
          <TextArea {...inputProps} ref={textareaRef} />
        )}
        {label && !usePlaceholder && (
          <Label
            css={{ background }}
            htmlFor={inputId.current}
            notEmpty={disableLabelAnimation || value !== ''}
          >
            {label}
          </Label>
        )}
      </div>
      <ValidationError
        css={!hideErrors && (forceRequiredErrorMsg || !isValid) && show}
      >
        {errors
          ? errors.map((error, i) => [
            <span key={i}>{error}</span>,
              i < errors.length ? <br key={`br-${i}`} /> : undefined,
            ])
          : undefined}
      </ValidationError>
    </Container>
  );
};

export default TextField;
