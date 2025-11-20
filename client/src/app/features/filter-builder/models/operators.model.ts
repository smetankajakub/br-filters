export interface Operator {
  value: string;
  label: string;
}

export const STRING_OPERATORS: Operator[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'not contains' },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' }
];

export const NUMBER_OPERATORS: Operator[] = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'not equals' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'greater_or_equal', label: 'greater or equal' },
  { value: 'less_or_equal', label: 'less or equal' }
];

export const OPERATOR_GROUPS = {
  string: STRING_OPERATORS,
  number: NUMBER_OPERATORS
};
