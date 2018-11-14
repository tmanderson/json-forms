import { isObject, isFunction, get } from '../utils';

export default ($get, field, vars, evaluateForm) => {
  const result = isObject($get)
    ? evaluateForm($get, field, vars)
    : get(field, $get, get(vars, $get));

  return isFunction(result)
    ? result(field, vars)
    : result !== $get && result !== undefined
      ? result
      : null;
};