export default ($sum, field, vars, evaluateForm) =>
  [].concat($sum).reduce((s, v) => s + parseFloat(evaluateForm(v, field, vars)), 0);