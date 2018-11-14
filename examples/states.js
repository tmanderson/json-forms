const { exec: evaluateForm } = require("../dist");

/**
 * This form looks for `click` defined in the `field`.
 * If `click` is not defined, it assumes `0`
 * Then adds `1`
 */
const schema = {
  $clicks: {
    $sum: [
      {
        $or: [{ $get: "clicks" }, { $set: 0 }]
      },
      { $set: 1 }
    ]
  }
};

let nextState = evaluateForm(schema, {});
// state = { clicks: 1 }
nextState = evaluateForm(schema, nextState);
// state = { clicks: 2 }
nextState = evaluateForm(schema, nextState);
// state = { clicks: 3 }
console.log(nextState);
