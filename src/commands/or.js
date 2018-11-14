import { reduceOr, hasValue } from '../utils';

export default ($or, field, vars, evaluateForm) => {
  const result = [].concat($or).reduce(reduceOr(field, vars, evaluateForm), null);
  return hasValue(result) ? result : null;
}