import { toObject } from '../utils';

export default ($vals, field, vars, evaluateForm) =>
  $vals === true
    ? Object.values(field)
    : evaluateForm($vals, Object.values(toObject(field)), vars);