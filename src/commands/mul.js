export default ($mul, field, vars, evaluateForm) =>
  [].concat(evaluateForm($mul, field, vars)).reduce((p, v) => p * parseFloat(v), 1);