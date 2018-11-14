import { toArray } from '../utils';
export default ($reverse, field, vars, evaluateForm) =>
  $reverse === true ? toArray(field).reverse() : evaluateForm($reverse, toArray(field).reverse(), vars);