import { isArray } from '../utils';

export default ($neq, field, vars, evaluateForm) =>
  isArray($neq)
    ? $neq
      .map(q => evaluateForm(q, field, vars))
      .reduce((result, r, i) => i ? r != result : r)
    : field != evaluateForm($neq, field, vars)