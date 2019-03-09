import React from 'react';
import _ from 'lodash';

import Box, { VBox } from 'react-layout-components';
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Smile from '@material-ui/icons/Mood';
import ChipInput from 'material-ui-chip-input';
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

import CustomTextField from './components/TextField';
import CustomSelect from './components/SelectField';
import ImageUpload from './components/ImageUpload';

export default class Form extends React.Component {
  style = {
    width: '100%',
  };

  constructor(props) {
    super(props);
    this.state = {
      values: this.props.values,
      emojiPickerOpen: false,
      timeout: null,
      index: 0,
    };
  }

  DEFAULT_IMG = this.props.defaultImage || 'http://via.placeholder.com/50x50';

  handleEmojiText = (input) => {
    if (_.isString(input)) {
      const emoji = new EmojiConvertor();
      return emoji.replace_colons(input);
    } else return input;
  };

  handleChange = (field, value) => {
    const { fields } = this.props;
    const wholeField = fields.find(({ name, key }) => name === field || key === field);

    let transformedValue = value;
    if (wholeField && wholeField.emoji === true) {
      if (wholeField.type === 'text' || wholeField.type === 'multiLineText') {
        transformedValue = this.handleEmojiText(value);
      }
    }

    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
      this.setState({ timeout: null }, () => this.setChanges(field, transformedValue));
    } else {
      this.setChanges(field, transformedValue);
    }
  };

  getPickedEmoji = (field, emojiData) => {
    const pickedEmoji = `:${emojiData.name}:`;
    const { values } = this.state;

    if (pickedEmoji) {
      const newValue = values[field] ? `${values[field]}${pickedEmoji}` : pickedEmoji;
      this.handleChange(field, newValue);
    } else {
      console.log('ERROR: Invalid emoji code');
    }
  };

  handleEmojiPicker = () => {
    this.setState({ emojiPickerOpen: !this.state.emojiPickerOpen });
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

  getName = (name) => {
    return _.replace(name, /\./g, ' ');
  };

  getField = (field) => {
    const key = field.key || field.name || 'key';
    const type = field.type || 'text';
    const defaultValue = field.default || null;
    const name = field.name || 'field';
    const inputKey = `form-${key}`;
    const errors = this.props.errors;
    const disabled = field.disabled || false;
    const emoji = field.emoji || false;

    let errorText = '';

    if (_.get(errors, key)) {
      errorText = errors[key];
    }
    switch (type) {
      case 'text':
      case 'password':
      case 'number':
        return (
          <CustomTextField
            field={field}
            errors={this.props.errors}
            value={this.getProperty(key, defaultValue, '')}
            onChange={(event) => this.handleChange(key, event.target.value)}
          />
        );

      case 'multiLineText': {
        return (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <CustomTextField
                field={field}
                errors={this.props.errors}
                value={this.getProperty(key, defaultValue, '')}
                onChange={(event) => this.handleChange(key, event.target.value)}
                multiline
                rows={field.rows || 1}
                rowsMax={field.rowsMax || 3}
                // inputStyle={{ marginTop: 3 }}
                // floatingLabelStyle={{ top: 40 }}
              />
              {emoji ? (
                <div>
                  <IconButton onClick={this.handleEmojiPicker}>
                    <Smile />
                  </IconButton>
                </div>
              ) : null}
            </div>
            {emoji && this.state.emojiPickerOpen ? (
              <EmojiPicker
                onEmojiClick={(emoji, emojiData) => this.getPickedEmoji(key, emojiData)}
              />
            ) : null}
          </div>
        );
      }

      case 'select': {
        return (
          <CustomSelect
            field={field}
            errors={this.props.errors}
            selectedValues={this.getProperty(key, defaultValue, field.multiple ? [] : '')}
            onChange={(event) => this.handleChange(key, event.target.value)}
          />
        );
      }

      case 'checkbox': {
        return (
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.getProperty(key, defaultValue, false)}
                    value={`${this.getProperty(key, defaultValue, false)}`}
                    onClick={(event) => {
                      this.handleChange(key, event.target.checked);
                    }}
                    disabled={disabled}
                  />
                }
                label={this.getName(name)}
              />
            </FormGroup>
          </FormControl>
        );
      }

      case 'chip': {
        const value = this.getProperty(key, defaultValue, []);
        return (
          <V0MuiThemeProvider muiTheme={getMuiTheme({ primary1Color: 'red' })}>
            <ChipInput
              key={inputKey}
              value={value}
              hintText={this.getName(name)}
              floatingLabelText={this.getName(name)}
              underlineFocusStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
              fullWidth
              onRequestAdd={(chip) => this.handleChange(key, _.concat(value, chip))}
              onRequestDelete={(chip) => this.handleChange(key, _.without(value, chip))}
              errorText={errorText}
            />
          </V0MuiThemeProvider>
        );
      }

      case 'image':
      case 'image2': {
        const defaultImg = defaultValue || this.DEFAULT_IMG;
        return (
          <ImageUpload
            field={field}
            srcValue={this.getProperty(key, defaultImg, '') + '?' + new Date().getTime()}
            defaultImg={this.DEFAULT_IMG}
            handleChange={this.handleChange}
          />
        );
      }
    }
  };

  getFields = () =>
    this.props.fields.map((field, index) => (
      <div key={`form-field-container-${index}`} style={this.props.inputContainerStyle}>
        {this.getField(field)}
      </div>
    ));

  render() {
    let FieldContainer = VBox;
    if (this.props.orientation === 'horizontal') {
      FieldContainer = Box;
    }
    return (
      <VBox style={this.style}>
        <FieldContainer
          style={{ overflow: 'auto', ...this.props.fieldContainerStyle }}
          flex={1}
          wrap={this.props.wrap}
        >
          {this.getFields()}
        </FieldContainer>
        <Box style={{ justifyContent: 'center', ...this.props.actionContainerStyle }}>
          {this.props.saveForm && (
            <Button
              variant="contained"
              onClick={() => this.props.saveForm(this.state.values)}
              style={{ display: 'block', margin: '0 auto', width: '30%' }}
            >
              {'Save'}
            </Button>
          )}
        </Box>
      </VBox>
    );
  }
}
