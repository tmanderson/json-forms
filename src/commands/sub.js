export default ($sub, field, vars, evaluateForm) =>
  [].concat($sub).reduce((s, v) => s - parseFloat(evaluateForm($sub, field, vars)), 0);