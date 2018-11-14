export default ($reduce, field, vars, evaluateForm) =>
  [].concat($reduce).reduce((v, q) => evaluateForm(q, v, vars), field);