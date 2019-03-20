import React from 'react';
import _ from 'lodash';

import Box, { VBox } from 'react-layout-components';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Smile from '@material-ui/icons/Mood';
import EmojiPicker from 'emoji-picker-react';
import EmojiConvertor from 'emoji-js';

import CustomTextField from './components/TextField';
import ImageUpload from './components/ImageUpload';

import Select from './components/Select';
import AsyncSelect from './components/AsyncSelect';
import ChipInput from './components/ChipInput';

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
    const errors = this.props.errors;

    const key = field.key || field.name || 'key';
    const type = field.type || 'text';
    const defaultValue = field.default || null;
    const name = field.name || 'field';
    const disabled = field.disabled || false;
    const emoji = field.emoji || false;

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

      case 'select':
        return (
          <Select
            field={field}
            errors={this.props.errors}
            selectedValue={this.getProperty(key, defaultValue, field.multiple ? [] : '')}
            onChange={(value) => this.handleChange(key, value)}
            // onInputChange={(value) => {
            //   console.log(value);
            // }}
            // onChange={(value) => console.log(value)}
            // autocomplete
          />
        );

      case 'asyncSelect':
        return (
          <AsyncSelect
            field={field}
            errors={this.props.errors}
            onChange={(value) => this.handleChange(key, value)}
            selectedValue={this.getProperty(key, defaultValue, field.multiple ? [] : '')}
            // defaultValue={defaultValue}
          />
        );

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
          <ChipInput
            field={field}
            value={value}
            onChange={(value) => this.handleChange(key, value)}
            errors={errors}
          />
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
      <div
        key={`form-field-container-${index}`}
        style={{ margin: '10px 0', ...this.props.inputContainerStyle }}
      >
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
          style={{
            // overflow: 'auto', // TODO: mess up the select field scroll menu
            backgroundColor: '#fefefe',
            padding: 10,
            ...this.props.fieldContainerStyle,
          }}
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
