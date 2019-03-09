import React from 'react';
import { func, shape, string, oneOf } from 'prop-types';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import FineUploaderTraditional from 'fine-uploader-wrappers';

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
  color: 'rgba(0, 0, 0, 0.3)',
};

const getName = (name) => {
  return _.replace(name, /\./g, ' ');
};

const ImageComponent = ({ field, handleChange, srcValue, defaultImg }) => {
  const name = field.name || 'field';
  const key = field.key || field.name || 'key';
  const endpoint = field.resource;

  const imageStyle = {
    display: 'block',
    marginBottom: 10,
    width: 50,
    height: 50,
  };

  if (_.get(field, 'position') === 'flex') {
    imageStyle.width = '100%';
    imageStyle.height = 150;
    imageStyle.objectFit = 'cover';
  }

  const uploader = new FineUploaderTraditional({
    options: {
      request: {
        multiple: false,
        inputName: 'file',
        endpoint,
      },
      callbacks: {
        onComplete: (id, name, response) => {
          if (response.success) {
            handleChange(key, _.get(field, 'prefix') + name);
            return _.get(field, 'onSuccess', () => {})(name, true);
          }
          return _.get(field, 'onError', () => {})(name, response);
        },
      },
    },
  });

  return (
    <div>
      <label style={imageLabelStyle}>{getName(name)}</label>
      <div style={{ cursor: 'pointer', width: '100%' }}>
        <img
          src={srcValue}
          onError={(e) => {
            e.target.src = defaultImg;
          }}
          style={imageStyle}
        />
        <Button component="label">
          <input
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(onChangeEvent) => {
              uploader.methods.addFiles(onChangeEvent.target);
            }}
          />
          {`upload`}
        </Button>
      </div>
    </div>
  );
};

ImageComponent.defaultProps = {
  errors: {},
};

ImageComponent.propTypes = {
  handleChange: func.isRequired,
  field: shape({
    name: string,
    key: string,
    resource: string,
    position: oneOf(['flex']),
    prefix: string,
  }).isRequired,
  srcValue: string.isRequired,
  defaultImg: string.isRequired,
};

export default ImageComponent;
