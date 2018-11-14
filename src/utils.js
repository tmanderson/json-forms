import CircularJSON from 'circular-json';

export const NIL = Symbol('nil');
export const RELATIVE_PARENT_RE = /\.\.\//g;

export const hasValue = v => v !== NIL;
export const isNil = val => val === undefined || val === null;
export const isObject = val => !Array.isArray(val) && val.constructor.name === 'Object';
export const isEmpty = val => typeof val === 'object' ? Object.keys(val).length < 1 : !val;
export const isFunction = val => typeof val === 'function';
export const isArray = val => Array.isArray(val);
export const isString = val => (typeof val === 'string');
export const isBoolean = val => (typeof val === 'boolean');
export const isUndefined = val => val === undefined;
export const isNumber = val => (typeof val === 'number');
export const isPrimitive = val => isBoolean(val) || isString(val) || isNumber(val) || isNil(val);
export const newOfType = val => {
  if (isString(val)) return '';
  if (isArray(val)) return [];
  if (isObject(val)) return {};
  if (isBoolean(val)) return true;
  if (val.constructor) return new val.constructor();
  return val;
}

export const toObject = val => isPrimitive(val) ? {} : val;

export const toArray = val => isString(val)
  ? val.split('')
  : [].concat(isPrimitive(val) ? val : Object.values(val))

export const map = (val, iterator, keys = false) => isObject(val)
  ? Object.keys(val).reduce((obj, k, i) => ({ ...obj, [k]: iterator(keys ? k : val[k], keys ? val[k] : k, i) }, {}))
  : val.map((v, i) => iterator(keys ? i : v, keys ? v : i));

export const reduce = (val, iterator, acc) => isObject(val)
  ? Object.keys(val).reduce((acc, k, i, keys) => iterator(acc, val[k], k, { ...val, length: keys.length }), acc || {})
  : val.reduce((acc, v, i) => iterator(acc, v, i, val), acc || []);

export const filter = (val, predicate, keys = false) => isArray(val)
  ? val.filter((acc, v, i) => predicate(keys ? i : v, i, val))
  : Object.keys(val).reduce((obj, k) =>
    (v => isNil(v) ? obj : { ...obj, [k]: v })
    (predicate(keys ? k : val[k], keys ? val[k] : k, val)),
  {});

export const contains = (val, predicate, keys = false) => isObject(val)
  ? !!Object.keys(val).find(k => predicate(keys ? k : val[k], keys ? val[k] : k, val))
  : !!val.find((acc, v, i) => predicate(keys ? i : v, i, val));

/**
 * @param      {Object}  obj           An object
 * @param      {string}  key           A relative path string (eg. `'../../user.name'`)
 * @param      {Mixed}   defaultValue  The default value, if the `key` resolves to `nil` value
 * @return     {Array}   Similar to `get`, but incorporates relative paths
 * @example
 * 
 * relativePathValue({ some: { path: [] } }, 'some.path[0]../../some') => { path: [] };
 */
export const relativePathValue = (obj, key = '', defaultValue) =>
  (key || '').split('/').reduce(
    ([passing, value], k, i, all) => {
      if (passing === false || value === undefined || !value) return [false, defaultValue];
      if (k === '') return [passing, key && i === 0 ? (value || {})['/'] : value]; // indicative of normal path delimiter ('/')
      if (k === '.') return [passing, value]; // indicative of current path ('./')
      if (k === '..') return [passing, (value || {})['../']]; // indicative of parent path ('../')
      return [passing, get(value, k, undefined)];
    },
    [true, obj || {}]
  )[1];

export const get = (obj, path, defaultVal) =>
  !isNil(obj) && obj[path] ||
  `${path}`.replace(/(\w+?)\[(\d+?)\]/g, '$1.$2')
    .split('.')
    .map(v => v.replace(/^\[['"]|['"]\]$/g, '')) // for object keys `obj['some-prop']`
    .reduce((v, k) => {
      return v ? (isUndefined(v[k]) ? defaultVal : v[k]) : defaultVal;
    }, obj);

/**
 * Given a `root` and `path` with any number of relative directives (ie `../`)
 * will correctly resolve the formatted path relative to `root`
 *
 * @param   {String} root The root path (eg "the directory")
 * @param   {String} path The relative path (in the context of `root`)
 * @return  {String} The formatted path
 *
 * @example
 *   resolveRelativePath('some.path.list[0].item', '../../test') // 'some.path.test'
 */
export const resolveRelativePath = (root = '', path = '') =>
  root && /^\/|(\.\.\/)/.test(path)
    ? root
      .split('.')
      .slice(0, -(path.match(RELATIVE_PARENT_RE) || []).length || undefined)
      .concat(path.replace(/^\.\//g, '').replace(RELATIVE_PARENT_RE, ''))
      .filter(v => !!v)
      .join('.')
    : `${root}${root && path ? '.' : ''}${path}`;

/**
 * returns the value of `p` in the first object which has that key
 */
const getValFromEither = (p, obj1, obj2) => (p in obj1 ? obj1[p] : obj2[p]);
/**
 * merges two objects at most `n` levels
 */
export const mergeMax = (source, object, n = 100, mergeArray = true) => {
  if (!source || !object || n < 0) return !isNil(object) ? object : source;
  if (Array.isArray(source)) {
    // The output array will have the length of the longer list
    return mergeArray
      ? new Array(Math.max(source.length, object.length))
        .fill(0)
        .map(
          (_, i) =>
            typeof (source[i] || object[i]) === 'object'
              ? mergeMax(source[i], object[i], n - 1, mergeArray)
              : getValFromEither(i, object, source)
        )
      : object
  }
  return Object.keys(source).concat(Object.keys(object)).reduce(
    (merged, prop) =>
      Object.assign(merged, {
        [prop]: object[prop] &&
          source[prop] &&
          typeof source[prop] === 'object' &&
          typeof object[prop] === 'object'
          ? mergeMax(source[prop], object[prop], n - 1, mergeArray)
          : getValFromEither(prop, object, source)
      }),
    {}
  );
};

export const reduceWith = (field, vars, evaluateForm) =>
  (v, q) => evaluateForm(q, v, vars);

export const reduceAnd = (field, vars, evaluateForm) =>
  (v, q) => hasValue(v) && v
    ? evaluateForm(q, field, vars)
    : NIL;

export const reduceOr = (field, vars, evaluateForm) =>
  (v, q) => (v !== NIL && (v || v === 0)
    ? v
    : evaluateForm(q, field, vars));

export const debug = (form, vars, field = null, output = null) => {
  console.group(`[FORM DEBUG]`);
  console.log('Form:');
  console.log(JSON.parse(CircularJSON.stringify(form)));
  console.log('Vars:');
  console.log(JSON.parse(CircularJSON.stringify(vars)));
  console.log('Field:');
  console.log(JSON.parse(CircularJSON.stringify(field)));
  console.log(`Result: ${CircularJSON.stringify(output)}`);
  console.groupEnd();
};
