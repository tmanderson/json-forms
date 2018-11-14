import { isString } from '../utils';

export default ($regex, field) =>
  (groups => groups ? groups.length === 0 || groups.slice(1) : groups)
  ((isString(field) ? field : '').match(new RegExp(...$regex.split('/').slice(1))) || null);