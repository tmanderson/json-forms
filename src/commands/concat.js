/**
 * @function concat
 * @argument [Array] query
 * @returns A concatenated string or list, depending on the output of the
 *          first query
 * @example
 * ```
 *  $concat: [
 *    { $set: 'anderson' },
 *    { $set: "," },
 *    { $set: 'tom' }
 *  ]
 * ```
 */
export default ($concat, field, vars, evaluateForm) =>
  []
    .concat($concat)
    .reduce(
      (v, f) =>
        v
          ? typeof v === "string"
            ? `${v}${evaluateForm(f, field, vars)}`
            : [].concat(v).concat(evaluateForm(f, field, vars))
          : evaluateForm(f, field, vars),
      ""
    );
