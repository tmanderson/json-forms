export default ($eval, field, vars, evaluateForm) =>
  evaluateForm(eval(`(function(){return ${evaluateForm($eval, field, vars)};})()`), field, vars);