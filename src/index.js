import React from 'react';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Box, { VBox } from 'react-layout-components';
import ChipInput from 'material-ui-chip-input';
import SelectField from 'material-ui/SelectField';
const FileUpload = require('react-fileupload');
import MenuItem from 'material-ui/MenuItem';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';

export default class Form extends React.Component {
  state = {
    timeout: null,
    values: {}
  };

  style = {
    width: '100%'
  };

  constructor(props) {
    super(props);
    this.state = {
      values: this.props.values
    };
  }

  DEFAULT_IMG = this.props.defaultImage || 'http://via.placeholder.com/50x50';
  underlineFocusStyle = this.props.focusStyle || {};
  floatingLabelFocusStyle = this.props.focusStyle || {};

  handleChange = (field, value) => {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({ timeout: null }, () => this.setChanges(field, value));
    } else {
      this.setChanges(field, value);
    }
  };

  setChanges = (field, value) => {
    if (this.props.handleChange) {
      this.props.handleChange(field, value);
    }
    const values = { ...this.props.values, ...this.state.values, [field]: value };
    this.setState({ values }, () => {
      if (!this.props.delayTime || !this.props.onDelayedChange) {
        return false;
      }
      let time = 0;
      if (_.includes(this.props.delayTriggers, field)) {
        time = this.props.delayTime;
      }
      const timeout = setTimeout(() => {
        this.props.onDelayedChange(values);
      }, time);
      this.setState({ timeout });
    });
    if (this.props.onChange) {
      this.props.onChange(values);
    }
  };

  getProperty = (key, defaultValue, formDefault) => {
    const componentDefault = _.get(this.props.values, key);
    return _.get(this.state.values, key, componentDefault || defaultValue || formDefault);
  };

  getName = name => {
    return _.replace(name, /\./g, ' ');
  };

  getItems = (items, parentKey) => {
    const values = items.map(item => item.value);
    return items.map(item => {
      let key = item.key || item.value || 'key';
      key = `${parentKey}-${key}`;
      return <MenuItem
        value={item.value} key={key} primaryText={item.title}
        checked={values && values.indexOf(name) > -1}
      />;
    });
  };

  getField = field => {
    const key = field.key || field.name || 'key';
    const type = field.type || 'text';
    const defaultValue = field.default || null;
    const name = field.name || 'field';
    const inputKey = `form-${key}`;
    const items = this.getItems(field.items || [], key);
    const errors = this.props.errors;
    const disabled = field.disabled || false;
    const empty = field.empty || false;
    const multiple = field.multiple || false;
    let errorText = '';
    if (_.get(errors, key)) {
      errorText = errors[key];
    }
    switch (type) {
      case 'text':
        return (
          <TextField
            key={inputKey}
            hintText={this.getName(name)}
            floatingLabelText={this.getName(name)}
            style={{ width: '100%' }}
            underlineFocusStyle={this.underlineFocusStyle}
            floatingLabelFocusStyle={this.floatingLabelFocusStyle}
            value={this.getProperty(key, defaultValue, '')}
            onChange={event => this.handleChange(key, event.target.value)}
            errorText={errorText}
            disabled={disabled}
          />
        );
      case 'multiLineText':
        return (
          <TextField
            key={inputKey}
            hintText={this.getName(name)}
            floatingLabelText={this.getName(name)}
            style={{ width: '100%' }}
            underlineFocusStyle={this.underlineFocusStyle}
            floatingLabelFocusStyle={this.floatingLabelFocusStyle}
            inputStyle={{ marginTop: 3 }}
            floatingLabelStyle={{ top: 40 }}
            value={this.getProperty(key, defaultValue, '')}
            onChange={event => this.handleChange(key, event.target.value)}
            multiLine={true}
            rows={field.rows || 1}
            rowsMax={field.rowsMax || 2}
            errorText={errorText}
            disabled={disabled}
          />
        );
      case 'number':
        return (
          <TextField
            type="number"
            hintText={name}
            style={this.style}
            underlineFocusStyle={this.underlineFocusStyle}
            floatingLabelFocusStyle={this.floatingLabelFocusStyle}
            floatingLabelText={name}
            value={this.getProperty(key, defaultValue, 0)}
            onChange={event => this.handleChange(key, parseInt(event.target.value))}
            errorText={errorText}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <SelectField
            key={inputKey}
            hintText={this.getName(name)}
            floatingLabelText={this.getName(name)}
            underlineFocusStyle={this.underlineFocusStyle}
            floatingLabelFocusStyle={this.floatingLabelFocusStyle}
            style={this.style}
            value={this.getProperty(key, defaultValue, '')}
            onChange={(event, index, value) => this.handleChange(key, value)}
            maxHeight={200}
            errorText={errorText}
            disabled={disabled}
            multiple = {multiple}
          >
            {empty && <MenuItem value={null} primaryText="" />}
            {items}
          </SelectField>
        );
      case 'datetime':
        return (
          <DateTimePicker
            DatePicker={DatePickerDialog}
            TimePicker={TimePickerDialog}
            format="YYYY-MM-DD HH:mm"
            timeFormat="24hr"
            returnMomentDate={true}
            onChange={value => {
              this.handleChange(key, value.format('YYYY-MM-DD HH:mm:ss'));
            }}
            key={inputKey}
            hintText={this.getName(name)}
            floatingLabelText={this.getName(name)}
            style={this.style}
            value={this.getProperty(key, defaultValue, '')}
            errorText={errorText}
            disabled={disabled}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            label={this.getName(name)}
            checked={this.getProperty(key, defaultValue, false)}
            onCheck={(event, isChecked) => this.handleChange(key, isChecked)}
            disabled={disabled}
          />
        );
      case 'chip': {
        const value = this.getProperty(key, defaultValue, []);
        return (
          <ChipInput
            key={inputKey}
            value={value}
            hintText={this.getName(name)}
            floatingLabelText={this.getName(name)}
            underlineFocusStyle={this.underlineFocusStyle}
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
            fullWidth
            onRequestAdd={chip => this.handleAddChip(key, value, chip)}
            onRequestDelete={chip => this.handleDeleteChip(key, value, chip)}
            errorText={errorText}
          />
        );
      }
      case 'image': {
        const defaultImg = defaultValue || this.DEFAULT_IMG;
        const options = {
          baseUrl: field.resource,
          fileFieldName: 'files',
          uploadSuccess: field.uploadSuccess,
          chooseAndUpload: true
        };
        return (
          <div>
            <label
              style={{
                fontSize: 16,
                lineHeight: '24px',
                width: '100%',
                display: 'inline-block',
                position: 'relative',
                backgroundColor: 'transparent',
                fontFamily: 'Roboto, sans-serif',
                transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                cursor: 'text',
                marginTop: 14,
                color: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              {this.getName(name)}
            </label>
            <div style={{ cursor: 'pointer' }}>
              <FileUpload options={options}>
                <img
                  ref="chooseAndUpload"
                  src={this.getProperty(key, defaultImg, '') + '?' + new Date().getTime()}
                  onError={e => {
                    e.target.src = this.DEFAULT_IMG;
                  }}
                  style={{ width: 50, height: 50 }}
                />
              </FileUpload>
            </div>
          </div>
        );
      }
    }
  };

  handleAddChip = (key, value, chip) => {
    this.handleChange(key, _.concat(value, chip));
  };

  handleDeleteChip = (key, value, chip) => {
    this.handleChange(key, _.without(value, chip));
  };

  getFields = () => {
    return this.props.fields.map((field, index) => {
      return (
        <div key={`form-field-container-${index}`} style={this.props.inputContainerStyle}>
          {this.getField(field)}
        </div>
      );
    });
  };

  render() {
    let FieldContainer = VBox;
    if (this.props.orientation === 'horizontal') {
      FieldContainer = Box;
    }
    return (
      <VBox style={this.style}>
        <FieldContainer style={{ overflow: 'auto', ...this.props.fieldContainerStyle }} flex={1} wrap={this.props.wrap}>
          {this.getFields()}
        </FieldContainer>
        <Box style={{ justifyContent: 'center', ...this.props.actionContainerStyle }}>
          {this.props.saveForm && (
            <FlatButton secondary={true} label="Save" onClick={() => this.props.saveForm(this.state.values)} />
          )}
          {this.props.deleteItem && <FlatButton label="Delete" secondary={true} onClick={this.props.deleteItem} />}
        </Box>
      </VBox>
    );
  }
}
