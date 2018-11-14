import { isObject, isArray } from '../utils';

export default ($set, field, vars, evaluateForm/*, commands*/) => {
  const result = isObject($set)
    ? Object.keys($set).reduce((res, k) => ({
      ...res,
      [k]: isArray($set[k])
        ? $set[k].map(v => evaluateForm(v, field, vars))
        : evaluateForm($set[k], field, vars)
    }), {})
    // Set the output to the value of `$set` otherwise
    : isArray($set)
      ? $set.map(v => evaluateForm(v, field, vars))
      : $set

  return result;
}