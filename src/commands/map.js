export default ($map, field, vars, evaluateForm) => {
  return [].concat(field).map((v, i) => evaluateForm($map, v, { ...vars, $i: i }));
}