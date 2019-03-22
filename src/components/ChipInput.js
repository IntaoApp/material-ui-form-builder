import _ from 'lodash';
import React from 'react';
import { shape, string, func, number, arrayOf, oneOfType } from 'prop-types';
import classNames from 'classnames';
import CreatableSelect from 'react-select/lib/Creatable';
import { makeStyles, useTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `2px 4px 2px 0`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      // theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      // theme.palette.grey[300],
      '#DCDCDC',
      0.08
    ),
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
}));

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

const getName = (name) => _.replace(name, /\./g, ' ');

const components = {
  Control,
  MultiValue,
  Placeholder,
  ValueContainer,
  DropdownIndicator: null,
};

const ChipInput = ({ field, value, onChange, errors }) => {
  const classes = useStyles();
  // const theme = useTheme();

  const [inputValue, setInputValue] = React.useState('');

  const key = field.key || field.name || 'key';
  const name = field.name || 'field';
  const errorText = _.get(errors, key, false);

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        onChange([...value, inputValue]);
        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <div>
      <CreatableSelect
        classes={classes}
        components={components}
        inputValue={inputValue}
        value={value.map((chip) => ({ label: chip, value: chip }))}
        onChange={(items) => {
          onChange(_.map(items, (item) => item.value));
        }}
        textFieldProps={{
          label: getName(name),
          InputLabelProps: {
            shrink: true,
          },
        }}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isClearable
        isMulti
        menuIsOpen={false}
      />
      {errorText && (
        <span
          style={{
            fontSize: '10px',
            color: 'red',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {errorText}
        </span>
      )}
    </div>
  );
};

ChipInput.defaultProps = {
  errors: {},
};

ChipInput.propTypes = {
  field: shape({ name: string, type: string, key: string }).isRequired,
  value: arrayOf(oneOfType([string, number])).isRequired,
  onChange: func.isRequired,
  errors: shape({}),
};

export default ChipInput;
