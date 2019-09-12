import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import RelativePortal from 'react-relative-portal';
import { shape, string, func, number, oneOfType, arrayOf } from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import AlertDialog from './AlertDialog';

const style = (theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
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
  noOptionsMessage: {
    // padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 14,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 14,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    // marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflowY: 'scroll',
  },
  divider: {
    // height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

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

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
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

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
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

function Menu(props) {
  return (
    <RelativePortal component="div" left={0} top={0}>
      <Paper
        square
        className={props.selectProps.classes.paper}
        style={{ width: '400px', zIndex: 1400 }}
        {...props.innerProps}
      >
        {props.children}
      </Paper>
    </RelativePortal>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const getName = (name) => _.replace(name, /\./g, ' ');

const formatSelectedValue = (selectedValue, options) => {
  if (_.isArray(selectedValue)) {
    return selectedValue.map((value) => options.find((option) => option.value === value));
  }

  return options.find((option) => option.value === selectedValue);
};

function IntegrationReactSelect({
  field,
  selectedValue,
  errors,
  onChange,
  classes,
  ...others
}) {
  const name = field.name || 'field';
  const dialogActive = field.dialogActive || false;
  const dialogContent = field.dialogContent || null;
  const dialogTitle = field.dialogTitle || null;

  const key = field.key || field.name || 'key';
  const errorText = _.get(errors, key, false);

  const items =
    field.empty && !field.multiple ? [{ value: '', title: '' }, ...field.items] : field.items;
  const options = items.map((item) => ({ value: item.value, label: item.title }));

  const selectStyles = {
    input: (base) => ({
      ...base,
      // color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const [value, setValue] = useState(selectedValue);
  const [modalOpen, setModalOpen] = useState(false);

  const prevValue = useRef(selectedValue);

  useEffect(
    () => {
      setValue(selectedValue);
    },
    [selectedValue]
  );

  useEffect(
    () => {
      onChange(value);
    },
    [value]
  );

  const handleUserChoice = (answer) => {
    switch (answer) {
      case 'cancel':
        setValue(prevValue.current);
        break;
      case 'ok':
        prevValue.current = valueState;
        break;
      default:
        break;
    }
    setModalOpen(false);
  };

  const handleOnChange = (value) => {
    const handelerValue = field.multiple ? value.map((item) => item.value) : value.value;
    setValue(handelerValue);

    if (dialogActive && prevValue.current !== handelerValue) {
      setModalOpen(true);
    } else {
      prevValue.current = handelerValue;
    }
  };

  return (
    <div className={classes.root}>
      <AlertDialog
        userChoice={handleUserChoice}
        open={modalOpen}
        content={dialogContent}
        title={dialogTitle}
      />
      <Select
        classes={classes}
        styles={selectStyles}
        textFieldProps={{
          label: getName(name),
          InputLabelProps: {
            shrink: true,
          },
        }}
        options={options}
        components={components}
        value={formatSelectedValue(value, options)}
        onChange={handleOnChange}
        // placeholder=""
        isMulti={field.multiple}
        {...others}
      // menuIsOpen={true}
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
}

IntegrationReactSelect.defaultProps = {
  errors: {},
};

IntegrationReactSelect.propTypes = {
  field: shape({ name: string, type: string, key: string }).isRequired,
  selectedValue: oneOfType([oneOfType([string, number]), arrayOf(oneOfType([string, number]))])
    .isRequired,
  onChange: func.isRequired,
  errors: shape({}),
};

export default withStyles(style)(IntegrationReactSelect);
