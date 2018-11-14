import { isArray } from '../utils';

export default ($eq, field, vars, evaluateForm) =>
  isArray($eq)
    ? $eq
      .map(q => evaluateForm(q, field, vars))
      .reduce((result, r, i) => i ? r == result : r)
    : field == evaluateForm($eq, field, vars)