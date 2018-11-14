import { parse as parseForm } from "./parser";
import evaluateForm from "./eval";

export default {
  compileToJSON: parseForm,
  exec: (form, field, vars) =>
    evaluateForm(form, field, { ...vars, "/": field }),
  compileAndExec: (form, field, vars) =>
    evaluateForm(parseForm(form), field, { ...vars, "/": field })
};
