import { hasValue, reduceAnd } from "../utils";
/**
 * @function and
 * @argument [Array] query
 * @returns [Boolean] `false` if _any_ query returns falsey value
 *          [Any]     The result of the _last_ query (if all preceeding pass)
 *
 * @example
 * ```
 *  $and: [
 *    { ...query1 },
 *    { ...query2 }
 *  ]
 * ```
 */
export default ($and, field, vars, evaluateForm) => {
  const result = []
    .concat($and)
    .reduce(reduceAnd(field, vars, evaluateForm), true);
  return hasValue(result) ? result : null;
};
