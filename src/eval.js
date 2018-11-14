import {
  debug,
  isNil,
  isEmpty,
  isPrimitive,
  isFunction,
  isArray,
  get,
  hasValue,
  relativePathValue
} from "./utils";

import * as commands from "./commands";

/**
 * Evaluates the given `form` over the specified `field`
 *
 * @param  {Object} form  - The HJSON form to be evaluated
 * @param  {Object} field - The field to apply `form` over
 * @return {Mixed}        - The result of evaluating `form` over `field`
 */
export default function evaluateForm(form, field, vars) {
  let result;
  // Default arg wasn't holding value correctly on recursive calls node@10.10
  if (vars === undefined) vars = { CMD_PREFIX: "$" };
  if (!("CMD_PREFIX" in vars)) vars.CMD_PREFIX = "$";
  // Any other primitive is ALWAYS returned
  if (
    isFunction(form) ||
    isNil(form) ||
    !hasValue(form) ||
    isPrimitive(form) ||
    isEmpty(form)
  )
    return form;

  if (isArray(form)) return form.map(f => evaluateForm(f, field, vars));

  const $var = form[`${vars.CMD_PREFIX}var`];
  const $debug = form[`${vars.CMD_PREFIX}debug`];
  // Removing $debug and removing $var
  // from `field` so it doesn't end up getting assigned to output
  // on an implicit `$set`
  form = isArray(form)
    ? form
    : Object.entries(form).reduce(
        (filteredForm, [k, v]) => ({
          ...filteredForm,
          ...(v === $var || v === $debug ? {} : { [k]: v })
        }),
        {}
      );

  if (!isNil($var) && isArray($var)) vars[$var[0]] = $var[1];
  // INPUT RESOLUTION -- unknown keys are inherently $get (or $vars), refining `field`
  // for subsequent queries.
  result = Object.entries(form)
    .filter(([k]) => k.charAt(0) !== vars.CMD_PREFIX) // filter out commands and implicit `$set`s
    .reduce((res, [p, value], i, keys) => {
      // First we check if the non-command is a $var
      if (p in vars) {
        // $vars can be functions, if provided at evaluation
        if (isFunction(vars[p]))
          return evaluateForm(vars[p](value, field, vars), field, vars);
        // Otherwise, evaluate the value of the var `p`
        return evaluateForm(vars[p], field, vars);
      }
      if (isNil(value)) return null;
      // First assume unknown key is on `field`, then in `vars`, otherwise `null`
      const f =
        get(field, p, null) ||
        get(vars, p, null) ||
        relativePathValue(vars, p, null);
      const v = !isNil(f)
        ? {
            // Continue to hold stack by appending `../` to any pre-existing paths
            ...Object.entries(vars).reduce(
              (newVars, [key, val]) => ({
                ...newVars,
                [/^\.\.\//.test(key) ? `../${key}` : key]: val
              }),
              {}
            ),
            // If the current path, `p`, is a relative UP, we do not store current field as `../`
            ...(/^\.\.\//.test(p) ? {} : { ["../"]: field })
          }
        : vars;

      return evaluateForm(value, f || field, v);
    }, {});

  // COMMANDS
  result = Object.entries(form)
    .filter(([k]) => k.charAt(0) === vars.CMD_PREFIX && !(k in vars))
    .map(([k, v]) => [k.replace(vars.CMD_PREFIX, ""), v])
    .reduce(
      (result, [k, value]) =>
        k in commands && commands[k] // is it a command?
          ? commands[k](
              value,
              field,
              { ...vars, $this: field },
              evaluateForm,
              commands
            )
          : result, // if not, return whatever we have as result
      result
    );
  if (!isNil($debug)) debug(form, vars, field, result);
  return result;
}
