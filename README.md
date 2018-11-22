# material-ui-form-builder
This project is used by Lessence.One for build easily [Material-UI][mui] forms with every built-in or 3rd party material ui component like [material-ui-chip-input][muichip]. We continuously increase the number of components when we need it or by pull requests.

## Disclaimer
This is just a quick tentative try to create a component where we have form state management, form builder and  material ui. Later we would like to replace the quick solutions with existing ones to provide as many feature as we can.

## Installation
```shell
npm i --save material-ui-form-builder
```

## Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Form from 'material-ui-form-builder';

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
        errors={{limit: 'This field is required.'}}
      />
    </MuiThemeProvider>
  </div>,
  document.getElementById('root')
);
```
## Form fields
### text
Example:
```{name: 'name',  type: 'text'}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `string` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |

### multiLineText
Example:
```{name: 'name',  type: 'multiLineText', rows: 5}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `number` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |
| rows | `number` | 1 | Number of rows to display |
| rowsMax | `number` | 2 | Maximum number of rows to display |
| addEmoji | `bool` | `false` | Set true to make visible the emoji-picker |


### number
Example:
```{name: 'name',  type: 'number'}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `string` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |

### select
Example:
```{name: 'name',  type: 'select', items: [{value: 1, title: 'item'}]}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `mixed` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| items | `array` | | The list for select items. |
| key | `string` | `key` | The identifier in the values object |
| multiple | `bool` | `false` | Will support multiple selections, if value is trues |
| name | `string` | `field` | The label of the field |

### datetime
Example:
```{name: 'name',  type: 'datetime'}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `date` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |

### checkbox
Example:
```{name: 'name',  type: 'checkbox'}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `mixed` | | The default value for the field |
| disabled | `bool` | | Set true to disable the field |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |

### chip
Example:
```{name: 'name',  type: 'chip', items: [{value: 1, title: 'item'}]}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `mixed` | | The default value for the field |
| items | `array` | | The list for select items. |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |





## Properties
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| delayTime | `number` | | In case when you would like to fire a delayed event about value changes. |
| delayTriggers | `array` | | The field elements that fire the onDelayedChange callback when these fields are changed, delayed by the delayTime prop. Every other field has 0 delay time. |
| errors | `object` | | The object to show errors by field. Example: `{name: 'This field is required.'}` |
| focusStyle | `object` | |The style object to use to override floating label styles when focused. |
| handleChange | `function` | | Callback function that is fired when one of the field's value changes. Signature: `function(field: string, value: mixed) => void` |
| onChange | `function` | | Callback function that is fired when the form values changes. Signature: `function(values: object) => void` |
| onDelayedChange | `function` | | Callback function that is fired delayed when the form values changes. Signature: `function(values: object) => void` |
| saveForm | `function` | | If this property passed to the component then a save button is displayed. Callback function that is fired when click to save button. Signature: `function(values: object) => void` |
| values | `object` | | The values for the form fields |


Please open an issue if something is missing or does not work as expected.


[mui]: http://www.material-ui.com/#/
[muichip]: https://github.com/TeamWertarbyte/material-ui-chip-input
