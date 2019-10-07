import React from 'react';
import _ from 'lodash';
import { number, func, shape, string, array, bool, oneOfType, oneOf } from 'prop-types';
import TextField from '@material-ui/core/TextField';

const getName = (name) => _.replace(name, /\./g, ' ');

const CustomTextField = ({ field, value, errors, onChange, multiline, ...others }) => {
  const key = field.key || field.name || 'key';
  const inputKey = `form-${key}`;
  const name = field.name || 'field';
  const disabled = field.disabled || false;
  const helpertext = field.helpertext || '';
  const type = field.type || 'text';

  let errorText = _.get(errors, key, false);

  return (
    <TextField
      key={inputKey}
      type={type}
      placeholder={getName(name)}
      helperText={errorText ? errorText : helpertext}
      label={getName(name)}
      error={!!errorText}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      multiline={multiline}
      fullWidth
      {...others}
      InputProps={{ style: multiline ? { minHeight: '36px' } : { height: '36px' } }}
      data-cy={key}
    />
  );
};

CustomTextField.defaultProps = {
  errors: {},
  multiline: false,
};

CustomTextField.propTypes = {
  onChange: func.isRequired,
  field: shape({
    name: string,
    type: oneOf(['text', 'select', 'multiLineText', 'number', 'password']),
    key: string,
    disabled: bool,
  }).isRequired,
  value: oneOfType([string, number, array]),
  errors: shape({}),
  multiline: bool,
};

export default CustomTextField;
