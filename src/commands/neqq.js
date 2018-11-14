import { isArray } from '../utils';

export default ($neqq, field, vars, evaluateForm) =>
  isArray($neqq)
    ? $neqq
      .map(q => evaluateForm(q, field, vars))
      .reduce((result, r, i) => i ? r != result : r)
    : field != evaluateForm($neqq, field, vars)