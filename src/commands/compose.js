import { reduceWith } from "../utils";

/**
 * @function compose
 * @argument [Array] of queries
 * @returns  [Any] The result of the last query
 * @example
 * ```js
 *  $compose: [
 *    { $set: { name: { $set: { first: 'mitch', last: 'anderson' } } } },
 *    { $get: 'name.first' }
 *  ]
 * ```
 */
export default ($compose, field, vars, evaluateForm) =>
  [].concat($compose).reduce(reduceWith(field, vars, evaluateForm), field);
