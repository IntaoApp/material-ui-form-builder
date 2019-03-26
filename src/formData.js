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
  isActivated: true,
  chipField: ['chip1', 'chip2', 'chip3'],
  singleselect: 1,
  multiselect: [1, 2],
  asyncSelectSingle: { value: 1, label: 'first item' },
  asyncSelectMultiple: [{ value: 1, label: 'first item' }, { value: 2, label: 'second item' }],
  imageUpload: 'https://picsum.photos/1200/150',
};

const selectItems = [
  { value: 1, title: 'first item' },
  { value: 2, title: 'second item' },
  { value: 3, title: '3rd item' },
  { value: 4, title: '4th item' },
  { value: 5, title: 'item5' },
  { value: 6, title: 'item6' },
  { value: 7, title: 'item7' },
  { value: 8, title: 'item8' },
  { value: 9, title: 'item9' },
  { value: 10, title: 'item10' },
  { value: 11, title: 'item11' },
  { value: 12, title: 'item12' },
  { value: 13, title: 'item13' },
  { value: 14, title: 'item14' },
  { value: 15, title: 'item15' },
  { value: 16, title: 'item16' },
  { value: 17, title: 'item17' },
  { value: 18, title: 'item18' },
];

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

  { name: 'Activated', type: 'checkbox', key: 'isActivated' },

  {
    name: 'chips',
    type: 'chip',
    key: 'chipField',
  },

  {
    name: 'single select',
    type: 'select',
    items: [...selectItems],
    key: 'singleselect',
    multiple: false,
    empty: true,
  },

  {
    name: 'multiselect',
    type: 'select',
    items: [...selectItems],
    key: 'multiselect',
    multiple: true,
  },

  {
    name: 'asyncSelect single',
    type: 'asyncSelect',
    items: [{ value: 1, label: 'first item' }, { value: 2, label: 'second item' }],
    promiseOptions: (inputValue) =>
      new Promise((resolve) => {
        console.log('promiseOptions', inputValue);
        setTimeout(() => {
          resolve(
            [
              { value: 1, label: 'first item' },
              { value: 2, label: 'second item' },
              { value: 3, label: '3rd item' },
              { value: 4, label: '4th item' },
              { value: 5, label: 'item5' },
              { value: 6, label: 'item6' },
            ].filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
          );
        }, 1000);
      }),
    key: 'asyncSelectSingle',
    empty: true,
  },

  {
    name: 'asyncSelect multiple',
    type: 'asyncSelect',
    items: [{ value: 1, label: 'first item' }, { value: 2, label: 'second item' }],
    promiseOptions: (inputValue) =>
      new Promise((resolve) => {
        console.log('promiseOptions', inputValue);
        setTimeout(() => {
          resolve(
            [
              { value: 1, label: 'first item' },
              { value: 2, label: 'second item' },
              { value: 3, label: '3rd item' },
              { value: 4, label: '4th item' },
              { value: 5, label: 'item5' },
              { value: 6, label: 'item6' },
            ].filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
          );
        }, 1000);
      }),
    key: 'asyncSelectMultiple',
    multiple: true,
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
