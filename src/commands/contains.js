import { isObject, isArray } from "../utils";
/**
 * @function contains
 * @argument
 */
export default ($contains, field, vars, evaluateForm) => {
  const value = evaluateForm($contains, field, vars);
  // If the field's an object, look at keys and values
  if (isObject(field))
    return typeof value === "string"
      ? value in field
      : Object.values(field).includes(value);
  // If the field's a string or array
  if (typeof field === "string" || isArray(field))
    return field.indexOf(value) >= 0;
  return false;
};
