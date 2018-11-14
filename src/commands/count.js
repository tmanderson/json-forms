export default ($count, field, vars, evaluateForm) =>
  Object.values(evaluateForm($count, field, vars) || []).length;