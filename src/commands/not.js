export default ($not, field, vars, evaluateForm) =>
  !evaluateForm($not, field, vars);