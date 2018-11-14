import { isArray } from '../utils';

export default ($filter, field, vars, evaluateForm) =>
  Object.keys(field || {})
    .filter(k => evaluateForm($filter, field[k], { ...vars, $k: k }))
    .reduce((out, k) => isArray(out) ? [...out, field[k]] : { ...out, [k]: field[k] }, isArray(field) ? [] : {})