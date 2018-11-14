export default ($pow, field, vars, evaluateForm) =>
  [].concat($pow).reduce((p, v) => Math.pow(parseFloat(evaluateForm($pow, field, vars)), p), 1);