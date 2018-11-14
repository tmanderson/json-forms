const path = require('path');
const repl = require('repl');
const parseForm = require(path.resolve(__dirname, '../src/parser')).default;
const evaluateForm = require(path.resolve(__dirname, '../src/eval')).default;

const dataSet = JSON.parse(
  require('fs').readFileSync(
    path.resolve(__dirname, '../test/data.json')
  ),
  null,
  2
);

let data = dataSet;

repl.start({
  prompt: '=> ',
  useGlobal: true,
  useColors: true,
  eval: (command, context, filename, callback) => {
    let cmd;

    try {
      cmd = parseForm(command);
    } catch(e) {
      return callback(new repl.Recoverable(e));
    }

    process.stdout.write(`executing form: ${JSON.stringify(cmd)}`);
    callback(
      null,
      evaluateForm(
        cmd,
        data || dataSet
      )
    );
  }
});
