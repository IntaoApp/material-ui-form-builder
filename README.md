# material-ui-form-builder
This project is used by Intao (T-Shaped). Build [Material-UI][mui] forms easily with every built-in or 3rd party material ui component like [material-ui-chip-input][muichip]. We continuously increase the number of components when we need it or by pull requests.

  * [Disclaimer](#disclaimer)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Form fields](#form-fields)
    + [text](#text)
    + [multiLineText](#multilinetext)
    + [number](#number)
    + [select](#select)
    + [datetime](#datetime)
    + [checkbox](#checkbox)
    + [chip](#chip)
  * [Form Properties](#form-properties)
  * [Dialog](#dialog)
    * [Properties of dialog](#properties-of-dialog)


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
| emoji | `bool` | `false` | Set true to make visible the emoji-picker |


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
| dialog | `obj` |  | Trigger a dialog to cancel/confirm a form change. See [Dialog](#dialog) below. |

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
| dialog | `obj` |  | Trigger a dialog to cancel/confirm a form change. See [Dialog](#dialog) below. |

### chip
Example:
```{name: 'name',  type: 'chip', items: [{value: 1, title: 'item'}]}```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| default | `mixed` | | The default value for the field |
| items | `array` | | The list for select items. |
| key | `string` | `key` | The identifier in the values object |
| name | `string` | `field` | The label of the field |





## Form Properties
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

## Dialog
Have a material-ui dialog triggered upon form change and allow the user to cancel or confirm, leading to a cancellation or confirmation of the form change internally and triggering of form state.

Simply define a configuration object like so: `dialog = { type: 'cancel-confirm', mainText: 'Really?'}`

And add it to your field configuration object, like so: ```{name: 'name',  type: 'select', items: [{value: 1, title: 'item'}], dialog}```

Dialog can be added to any form component but is called upon every form state change and as such only makes sense on `select`, `checkbox` and other closed format form fields. 

### Properties of dialog
| Name | Type | Default | Required? | Description | 
| --- | --- | --- | --- | --- |
| type | "cancel-confirm" or "confirm" | "cancel-confirm" | no | "cancel-confirm" mode includes button (and functionality) for cancelling a form state change, "confirm" merely notifies the user and lets her her acknowledge |
| title | `string`|  | no  | optional title |
| mainText | `string`|  | **yes**  | main text |
| renderCancel | `func`|  | no  | function that returns a component to render the cancel button, e.g. return a FlatButton component. `handleCancel` function gets passed in to be called e.g. onClick  |
| renderConfirm | `func`|  | no  | function that returns a component to render the confirm button, e.g. return a FlatButton component. `handleConfirm` function gets passed in and needs to be called e.g. onClick  |
| handleCancelCb | `func` | | no | allows you to pass in a function as callback that gets called on cancel. Gets `fieldName` and `fieldValue` passed in
| handleConfirmCb | `func` | | no | allows you to pass in a function as callback that gets called on confirm. Gets `fieldName` and `fieldValue` passed in




[mui]: http://www.material-ui.com/#/
[muichip]: https://github.com/TeamWertarbyte/material-ui-chip-input
