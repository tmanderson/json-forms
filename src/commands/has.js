import { toArray, isObject } from '../utils';

export default ($has, field) =>
  isObject(field)
    ? !!$has.split('.').reduce((val, k) => typeof val === 'object' && val[k], field)
    : toArray(field).includes($has);