import _ from 'lodash';
import React from 'react';
import RelativePortal from 'react-relative-portal';
import { shape, string, func, number, oneOfType, arrayOf } from 'prop-types';
import classNames from 'classnames';
import AsyncSelect from 'react-select/lib/Async';
import { makeStyles, useTheme } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
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
}));

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
        {...props.innerProps}
        style={{ width: '400px', zIndex: 1400 }}
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

function IntegrationReactSelect({ field, errors, selectedValue, onChange, ...others }) {
  const classes = useStyles();
  // const theme = useTheme();

  const name = field.name || 'field';
  const promiseOptions = field.promiseOptions || null;

  const key = field.key || field.name || 'key';
  const errorText = _.get(errors, key, false);

  const items =
    field.items && field.empty && !field.multiple
      ? [{ value: '', label: '' }, ...field.items]
      : field.items;

  const selectStyles = {
    input: (base) => ({
      ...base,
      // color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  return (
    <div className={classes.root}>
      <AsyncSelect
        classes={classes}
        styles={selectStyles}
        textFieldProps={{
          label: getName(name),
          InputLabelProps: {
            shrink: true,
          },
        }}
        loadOptions={promiseOptions}
        value={selectedValue}
        components={components}
        onChange={onChange}
        defaultOptions={items}
        isMulti={field.multiple}
        {...others}
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
  selectedValue: oneOfType([
    arrayOf(
      shape({
        value: oneOfType([string, number]),
        label: string,
      })
    ),
    shape({
      value: oneOfType([string, number]),
      label: string,
    }),
  ]).isRequired,
  onChange: func.isRequired,
  errors: shape({}),
};

export default IntegrationReactSelect;
