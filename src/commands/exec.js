export default ($exec, field, vars, evaluateForm) =>
  evaluateForm(typeof $exec === 'string' ? vars[$exec] : $exec, field, vars);