import { isArray } from '../utils';

export default ($eqq, field, vars, evaluateForm) =>
  isArray($eqq)
    ? $eqq
      .map(q => evaluateForm(q, field, vars))
      .reduce((result, r, i) => i ? r == result : r)
    : field == evaluateForm($eqq, field, vars)