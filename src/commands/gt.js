import { isArray } from '../utils';

export default ($gt, field, vars, evaluateForm) =>
  isArray($gt)
    ? $gt.map(q => evaluateForm(q, field, vars)).reduce((result, r, i) => i ? r > result : r)
    : field > evaluateForm($gt, field, vars);

    