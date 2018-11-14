import { isArray } from '../utils';

export default ($lt, field, vars, evaluateForm) =>
  isArray($lt)
    ? $lt.map(q => evaluateForm(q, field, vars)).reduce((result, r, i) => i ? r < result : r)
    : field < evaluateForm($lt, field, vars);