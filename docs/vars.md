### `vars`

Vars are the "local scope" of a given query. They are available at _all_
levels of a query, they can be set and retrieved like `field` values
using `$var: [name, value]` to set and `$var: 'name'` to retrieve.

#### `CMD_PREFIX`

HJSON only has one `var` by default, `CMD_PREFIX`, which enables some pretty
interesting behaviors should the situation arise.

```js
{
  $var: ['CMD_PREFIX', '_'],
  _component: 'nav',
}
```

#### Stored Procedures

Assigning a form to a `$var` enables referencing and evaluation of that form
via `$exec`. The example below creates a stored procedure `getAge` which runs
a `$get` on the active field returning the value of `age`.

```js
const form = {
  $var: ["myForm", { $get: "age" }],
  $concat: [
    {
      users: {
        $map: {
          $exec: "myForm"
        }
      }
    },
    {
      employees: {
        $map: {
          $exec: "myForm"
        }
      }
    }
  ]
};
```

#### External Functions (ie. utilities, custom commands)

Providing external functionality to your forms can be achieved by adding any
values to the `vars` when evaluating a form.

```js
const form = {
  users: {
    $exec: 'parseUsers'
  }
};

const vars = {
  parseUsers: (users, field, vars) => // Do something with users
}
```

Notice that the above `var` can also be looked at as a completely new _command_
that is referenced _without_ the `CMD_PREFIX` (ie. `$`).
