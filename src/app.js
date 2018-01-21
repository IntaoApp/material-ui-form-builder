import React from 'react';
import ReactDOM from 'react-dom';
import Form from './index.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const fields = [
  {name: 'name',  type: 'text'},
  {name: 'limit', type: 'number'},
]
const muiTheme = getMuiTheme({});

ReactDOM.render(
  <div>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Form
        fieldContainerStyle={{backgroundColor: '#fefefe', padding: 10}}
        onChange={(values) => console.log(values)}
        fields={fields}
        values={{name: 'test', limit: 10}}
      />
    </MuiThemeProvider>
  </div>,
  document.getElementById('root')
);
