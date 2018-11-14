import CircularJSON from 'circular-json';
import { isString } from './utils';

const LOG = console.log;
const GROUPS = [];

(function() {
  if (!this || !this.window) {
    const chalk = require('chalk');

    Object.assign(console, {
      group: (name) => {
        const indent = (new Array(GROUPS.length)).fill(0).reduce((v) => `${v  }`, '');
        GROUPS.push(name);
        LOG(`${indent}${chalk.bold(name)}`);
        GROUPS.push(name);
      },
      groupEnd: () => {
        GROUPS.pop();
        console.log('');
      },
      log: (...values) => {
        const indent = (new Array(GROUPS.length)).fill(0).reduce((v) => `${v  }`, '');
        if (GROUPS.length)
          LOG(`${indent} ${values.map(v => !isString(v) ? CircularJSON.stringify(v, null, 2) : v).join(' ')}`);
        else
          LOG(...values);
      }
    })
  }
})();
