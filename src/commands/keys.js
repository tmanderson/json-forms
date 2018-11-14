import { toObject } from '../utils';
export default ($keys, field, vars, evaluateForm) =>
  $keys === true
    ? Object.keys(field)
    : evaluateForm($keys, Object.keys(toObject(field)), vars);