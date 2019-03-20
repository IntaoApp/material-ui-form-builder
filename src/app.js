import React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Form from './index.js';
import { values, fields } from './formData';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#8BC3D1' },
  },
  spacing: '8px',
});

const saveForm = (values) => {
  console.log(values);
};

ReactDOM.render(
  <div>
    <MuiThemeProvider theme={theme}>
      <Paper style={{ width: '40%', margin: '20px auto', paddingBottom: '30px' }}>
        <Form
          fieldContainerStyle={{ backgroundColor: '#fefefe', padding: 10 }}
          inputContainerStyle={{ margin: '30px 0' }}
          onChange={(values) => console.log(values)}
          onDelayedChange={(values) => console.log('delayed values: ', values)}
          delayTriggers={['simpleTextField']}
          delayTime={300}
          fields={fields}
          values={values}
          saveForm={saveForm}
          errors={{ simpleTextFieldWithError: 'This is an error message.' }}
        />
      </Paper>
    </MuiThemeProvider>
  </div>,
  document.getElementById('root')
);
