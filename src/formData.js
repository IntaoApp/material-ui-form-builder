export const values = {
  simpleTextField: 'simple text field default value',
  passwordTextField: 'password text field default value',
  numbertextField: 123124,
  multilientextField:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna\n' +
    'aliqua. Ut enim ad minim veniam, quis nostrud exercitation\n' +
    'ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  multilineTextFieldWithEmoji: '😅😌🤠😤😘',
  selectField: 1,
  isActivated: true,
  chipField: ['chip1', 'chip2', 'chip3'],
  imageUpload: 'https://picsum.photos/1200/150',
};

export const fields = [
  { name: 'simple text field', type: 'text', key: 'simpleTextField' },

  { name: 'simple text field with error', type: 'text', key: 'simpleTextFieldWithError' },

  { name: 'password text field', type: 'password', key: 'passwordTextField' },

  { name: 'number text field', type: 'number', key: 'numbertextField' },

  { name: 'multiline text field', type: 'multiLineText', key: 'multilientextField' },

  {
    name: 'multiline text field with emoji',
    type: 'multiLineText',
    key: 'multilineTextFieldWithEmoji',
    emoji: true,
  },

  {
    name: 'select',
    type: 'select',
    key: 'selectField',
    items: [{ value: 1, title: 'first item' }, { value: 2, title: 'second item' }],
    multiple: false,
    empty: true,
  },

  {
    name: 'multiple select',
    type: 'select',
    key: 'selectFieldMultiple',
    items: [{ value: 1, title: 'first item' }, { value: 2, title: 'second item' }],
    multiple: true,
  },

  { name: 'Activated', type: 'checkbox', key: 'isActivated' },

  {
    name: 'labels',
    type: 'chip',
    key: 'chipField',
  },

  {
    name: 'image upload',
    type: 'image',
    key: 'imageUpload',
    position: 'flex',
    resource: '/test',
    uploadSuccess: () => console.log('upload'),
  },
];
