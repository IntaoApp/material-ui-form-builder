import React from 'react';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Box, { VBox } from 'react-layout-components';
import ChipInput from 'material-ui-chip-input';
import SelectField from 'material-ui/SelectField';
const FileUpload = require('react-fileupload');
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import MenuItem from 'material-ui/MenuItem';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import Dialog from 'material-ui/Dialog';

import IconButton from 'material-ui/IconButton'
import Smile from 'material-ui/svg-icons/social/mood'
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

const FieldDialog = (props) => (<Dialog 
    {...props}
  >{props.mainText}</Dialog>)

export default class Form extends React.Component {

  style = {
    width: '100%'
  };

  constructor(props) {
    super(props);
    this.state = {
      values: this.props.values,
      emojiPickerOpen: false,
      timeout: null,
      index: 0,
      dialog: false,
    };
  }

  DEFAULT_IMG = this.props.defaultImage || 'http://via.placeholder.com/50x50';
  underlineFocusStyle = this.props.focusStyle || {};
  floatingLabelFocusStyle = this.props.focusStyle || {};

  handleEmojiText = (input) => {
    if(_.isString(input)) {
      const emoji = new EmojiConvertor();
      return emoji.replace_colons(input);
    }
    else return input;
  }

  handleDialog = (fieldName, fieldValue, dialogObj) => {
    const handleCancelInternal = (fieldName, fieldValue, cancelCallback) => {
      this.setState(({dialog}) => ({ dialog: {...dialog, open: false}}))
      cancelCallback && cancelCallback(fieldName, fieldValue);
    }
    const handleConfirmInternal = (fieldName, fieldValue, confirmCallback) => {
      this.setState(({dialog}) => ({ dialog: {...dialog, open: false}}))
      this.setChanges(fieldName, fieldValue);
      confirmCallback && confirmCallback(fieldName, fieldValue);
    }

    const renderCancelDefault = (handleCancel) => (<FlatButton
      label="Cancel"
      primary={true}
      onClick={() => {handleCancel()}}
      />)
    const renderConfirmDefault = (handleConfirm) => (<FlatButton
      label="OK"
      primary={true}
      onClick={() => {handleConfirm()}}
      />)

    const {
      type = 'cancel-confirm',
      title = false,
      mainText,
      renderCancel = renderCancelDefault,
      handleCancelCallback,
      renderConfirm = renderConfirmDefault,
      handleConfirmCallback,
    } = dialogObj;

    const forbidAlternativeExit = {};
    const actions = [];
    if(type === 'cancel-confirm') {
      forbidAlternativeExit.modal = true;
      actions[0] = renderCancel(() => { handleCancelInternal( fieldName, fieldValue, handleCancelCallback) })
      actions[1] = renderConfirm(() => { handleConfirmInternal( fieldName, fieldValue, handleConfirmCallback) })
    }
    else {
      forbidAlternativeExit.modal = false;
      actions[0] = renderConfirm(() => { handleConfirmInternal( fieldName, fieldValue, handleConfirmCallback) })
    }

    const dialog = {
      title,
      actions,
      ...forbidAlternativeExit,
      open: true,
      mainText,
    }
    this.setState({ dialog });
  }

  handleChange = (field, value) => {
    const { fields } = this.props;
    const wholeField = fields.find(({name, key}) => name === field || key === field)
    
    let transformedValue = value;
    if(wholeField && wholeField.emoji === true) {
      if(wholeField.type === 'text' || wholeField.type === 'multiLineText') {
        transformedValue = this.handleEmojiText(value);
      }
    }

    if(wholeField.dialog) this.handleDialog(field,value,wholeField.dialog)
    else {
      if (this.state.timeout) {
        clearTimeout(this.state.timeout);
        this.setState({ timeout: null }, () => this.setChanges(field, transformedValue));
      } else {
        this.setChanges(field, transformedValue);
      }
    }
  };

  getPickedEmoji = (field, emojiData) => {
    const pickedEmoji = `:${emojiData.name}:`;
    const { values } = this.state;

    pickedEmoji ? this.handleChange(field, values[field] + pickedEmoji) 
                : console.log("ERROR: Invalid emoji code");
  }

  handleEmojiPicker = () => {
    this.setState({ emojiPickerOpen: !this.state.emojiPickerOpen});
  }

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
    const emoji = field.emoji || false;

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
      case 'password':
          return (
            <TextField
              key={inputKey}
              hintText={this.getName(name)}
              floatingLabelText={this.getName(name)}
              type="password"
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
          <div>
            <div style={{
                display: "flex",
                alignItems: "flex-end",
                }}>
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
              {emoji ? 
                <div>
                  <IconButton onClick={() => this.handleEmojiPicker()}>
                    <Smile color='grey'/>
                  </IconButton>
                </div>
                : null
              }
            </div>
            { this.state.emojiPickerOpen ? <EmojiPicker onEmojiClick={ (emoji, emojiData) => this.getPickedEmoji(key, emojiData)}/> : null }
          </div>
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
            style={{ marginTop: '15px' }}
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
        const imageStyle = {
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
        }
        return (
          <div>
            <label
              style={imageStyle}
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
      case 'image2': {
        const defaultImg = defaultValue || this.DEFAULT_IMG;
        const imageLabelStyle = {
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
        }

        const imageStyle = {
          display: 'block',
          marginBottom: 10,
          width: 50,
          height: 50
        }
        if (_.get(field, 'position') === 'flex') {
          imageStyle.width = '100%';
          imageStyle.height = 150;
          imageStyle.objectFit = 'cover';
        }

        const uploader = new FineUploaderTraditional({
          options: {
            request: {
              endpoint: _.get(field, 'resource'),
              multiple: false,
              inputName: 'file',
            },
            callbacks: {
              onComplete: (id, name, response) => {
                if (response.success) {
                  this.handleChange(key, _.get(field, 'prefix') + name);
                  return _.get(field, 'onSuccess', ()=>{})(name, true);
                }
                return _.get(field, 'onError', ()=>{})(name, response);
              }
            }
          }
        });

        return (
          <div>
            <label
              style={imageLabelStyle}
            >
              {this.getName(name)}
            </label>
            <div style={{ cursor: 'pointer', width: '100%' }}>
              <img
                src={this.getProperty(key, defaultImg, '') + '?' + new Date().getTime()}
                onError={e => {
                  e.target.src = this.DEFAULT_IMG;
                }}
                style={imageStyle}
              />
              <RaisedButton
                containerElement="label"
                label="upload"
                primary
              >
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(onChangeEvent) => {
                    uploader.methods.addFiles(onChangeEvent.target)
                  }}
                />
              </RaisedButton>
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
    const { dialog } = this.state;
    return (
      <VBox style={this.style}>
        {dialog && <FieldDialog {...dialog}/>}
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

Form.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    dialog: PropTypes.shape({
      type: PropTypes.oneOf(['cancel-confirm', 'confirm']),
      title: PropTypes.string,
      mainText: PropTypes.string.isRequired,
      renderCancel: PropTypes.func,
      handleCancelCallback: PropTypes.func,
      renderConfirm: PropTypes.func,
      handleConfirmCallback: PropTypes.func
    })
  })).isRequired,
}