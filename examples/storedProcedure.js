const { exec: evaluateForm } = require("../dist");

const data = {
  users: [
    { age: 10 },
    { age: 15 },
    { age: 20 },
    { age: 53 },
    { age: 60 }
  ],
  employees: [
    { age: 18 },
    { age: 21 },
    { age: 22 },
    { age: 30 },
    { age: 25 }
  ]
}

const form = {
  // Get the value of the `age` property on the active field
  $var: ['myProcedure', { $get: 'age' }],
  // Concat the results of each query within the `$concat` list
  $concat: [
    {
      // Get the value at `users` (the array of `users`)
      users: {
        $map: { // map each value within `users`
          $exec: 'myProcedure' // execute `myProcedure` on each user and return the result
        }
      }
    },
    {
      // Get the value at `employees` (the array of `employees`)
      employees: {
        $map: { // map each value within `employees`
          $exec: 'myProcedure' // execute `myProcedure` on each employee and return the result
        }
      }
    }
  ]
};


console.log(evaluateForm(form, data)); // => [ 10, 15, 20, 53, 60, 18, 21, 22, 30, 25 ]
