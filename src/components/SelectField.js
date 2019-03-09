import React from 'react';
import _ from 'lodash';
import { array, shape, string, func, number, oneOfType } from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const getName = (name) => _.replace(name, /\./g, ' ');

const getRenderValue = (selected, items, multiple) => {
  if (!multiple) return items.find((item) => item.value === selected).title;

  return items
    .reduce((result, item) => {
      if (selected.includes(item.value)) {
        result.push(item.title);
      }
      return result;
    }, [])
    .join(', ');
};

const CustomSelect = ({ field, selectedValues, errors, onChange, ...others }) => {
  const key = field.key || field.name || 'key';
  const inputKey = `form-${key}`;
  const name = field.name || 'field';
  const disabled = field.disabled || false;
  const multiple = field.multiple || false;
  const helperText = field.helperText || '';
  const empty = field.empty || false;
  let errorText = _.get(errors, key, false);
  const items = field.items || [];

  return (
    <FormControl style={{ width: '100%' }} error={!!errorText}>
      <InputLabel htmlFor={`${getName(name)}`}>{getName(name)}</InputLabel>
      <Select
        key={inputKey}
        fullWidth
        multiple={multiple}
        label={getName(name)}
        value={selectedValues}
        onChange={onChange}
        renderValue={(selected) => getRenderValue(selected, items, multiple)}
        disabled={disabled}
        {...others}
      >
        {empty && !multiple && (
          <MenuItem key={'None'} value="">
            <Checkbox
              checked={multiple ? selectedValues.indexOf('') > -1 : selectedValues === ''}
            />
            <ListItemText primary={'None'} />
          </MenuItem>
        )}

        {items.map((item) => (
          <MenuItem key={item.title} value={item.value}>
            <Checkbox
              checked={
                multiple ? selectedValues.indexOf(item.value) > -1 : selectedValues === item.value
              }
            />
            <ListItemText primary={item.title} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errorText ? errorText : helperText}</FormHelperText>
    </FormControl>
  );
};

CustomSelect.defaultProps = {
  errors: {},
  multiline: false,
};

CustomSelect.propTypes = {
  field: shape({ name: string, type: string, key: string }).isRequired,
  selectedValues: oneOfType([array, oneOfType([string, number])]).isRequired,
  onChange: func.isRequired,
  errors: shape({}),
};

export default CustomSelect;
