export default ($div, field, vars, evaluateForm) =>
  [].concat($div).reverse().reduce((p, v) => parseFloat(evaluateForm($div, field, vars)) / p, 1);