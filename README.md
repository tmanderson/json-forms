# JSON Forms

### Lisp-like forms written in JSON and evaluated with JavaScript

A JavaScript interpreter for Lisp-like [forms](https://www.gnu.org/software/emacs/manual/html_node/elisp/Forms.html)
written in JSON.

### Example

```js
import evaluateForm from "@tmanderson/json-forms";
// A data model
const data = { users: [{ name: "lindsay" }, { name: "tom" }] };
// A JSON Form run against the data model
const form = { $concat: { users: { $map: { $get: "name" } } } };
// The result of that form
evaluateForm(form, data); // => ['lindsay', 'tom']
```

Or, using JSON Forms' [DSL](#json-forms-dsl) and the `compileAndEvaluate` method

```js
import { compileAndEvaluate } from "@tmandersno/json-forms";
// Our data model
const data = { users: [{ name: "lindsay" }, { name: "tom" }] };
// Our form against the model
const form = `
$concat
  users
    $map
      $get 'name'
`;
// The result of that form
compileAndEvaluate(form, data); // => ['lindsay', 'tom']
```

## JSON Forms DSL

JSON Forms ships with a parser (grammar can be viewed [here](src/parser/grammar.pegjs)) that
reduces a bit of the JSON noise when writing forms. JSON Forms exports both `compileToJSON`
and `compileAndExec` methods that directly consume a JSON Form writting in the DSL.

You can append any [command](src/commands) with a `!` (eg. `$get!`) to enable debug output on
a particular query.

#### For example, this:

```
$concat
  users
    $map
      $get 'name'
```

#### Would convert to this:

```js
{
  $concat: {
    users: {
      $map: {
        $get: "name";
      }
    }
  }
}
```

#### As another example, this:

```
people
  $and!
    $has 'lastName'
    $has 'firstName'
    $concat
      'lastName'
      ','
      'firstName'
```

#### Would convert to:

```js
{
  people: {
    $debug: true, // note: the `!` after `$and` above will debug a statement
    $and: [
      { $has: "lastName" },
      { $has: "firstName" },
      {
        $concat: ["lastName", ",", "firstName"]
      }
    ];
  }
}
```
