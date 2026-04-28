export const FieldType = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  URL: 'url',
  NUMBER: 'number',
  DATE: 'date',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BOOLEAN: 'boolean',
  TABLE: 'table',
  ENUM_CHECKBOXES: 'enum_checkboxes'
};

export const FIELD_TYPE_VALUES = Object.values(FieldType);

export const DEFAULT_FIELD_TYPE = FieldType.TEXT; 