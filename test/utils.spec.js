/* eslint-env jest */
const utils = require('../src/utils');

describe('UTILS', () => {
  test('hasValue', () => {
    expect(utils.hasValue(utils.NIL)).toEqual(false);
    expect(utils.hasValue(false)).toEqual(true);
    expect(utils.hasValue(0)).toEqual(true);
    expect(utils.hasValue(undefined)).toEqual(true);
    expect(utils.hasValue(null)).toEqual(true);
  });
  test('isNil', () => {
    expect(utils.isNil(utils.NIL)).toEqual(false);
    expect(utils.isNil(false)).toEqual(false);
    expect(utils.isNil(0)).toEqual(false);
    expect(utils.isNil(undefined)).toEqual(true);
    expect(utils.isNil(null)).toEqual(true);
  });
  test('isObject', () => {
    expect(utils.isObject({})).toEqual(true);
    expect(utils.isObject([])).toEqual(false);
    expect(utils.isObject(function(){})).toEqual(false);
    expect(utils.isObject('string')).toEqual(false);
    expect(utils.isObject(true)).toEqual(false);
    expect(utils.isObject(false)).toEqual(false);
  });
  test('isFunction', () => {
    expect(utils.isFunction(function(){})).toEqual(true);
    expect(utils.isFunction({})).toEqual(false);
    expect(utils.isFunction([])).toEqual(false);
    expect(utils.isFunction('string')).toEqual(false);
    expect(utils.isFunction(true)).toEqual(false);
    expect(utils.isFunction(false)).toEqual(false);
  });
  test('isArray', () => {
    expect(utils.isArray([])).toEqual(true);
    expect(utils.isArray(new Array(4))).toEqual(true);
    expect(utils.isArray(function(){})).toEqual(false);
    expect(utils.isArray({})).toEqual(false);
    expect(utils.isArray('string')).toEqual(false);
    expect(utils.isArray(true)).toEqual(false);
    expect(utils.isArray(false)).toEqual(false);
  });
  test('isString', () => {
    expect(utils.isString('string')).toEqual(true);
    expect(utils.isString(function(){})).toEqual(false);
    expect(utils.isString({})).toEqual(false);
    expect(utils.isString([])).toEqual(false);
    expect(utils.isString(true)).toEqual(false);
    expect(utils.isString(false)).toEqual(false);
  });
  test('isBoolean', () => {
    expect(utils.isBoolean(true)).toEqual(true);
    expect(utils.isBoolean(false)).toEqual(true);
    expect(utils.isBoolean('string')).toEqual(false);
    expect(utils.isBoolean(function(){})).toEqual(false);
    expect(utils.isBoolean({})).toEqual(false);
    expect(utils.isBoolean([])).toEqual(false);
  });
  test('isUndefined', () => {
    expect(utils.isUndefined(undefined)).toEqual(true);
    expect(utils.isUndefined(null)).toEqual(false);
    expect(utils.isUndefined(true)).toEqual(false);
    expect(utils.isUndefined(false)).toEqual(false);
    expect(utils.isUndefined('string')).toEqual(false);
    expect(utils.isUndefined(function(){})).toEqual(false);
    expect(utils.isUndefined({})).toEqual(false);
    expect(utils.isUndefined([])).toEqual(false);
  });
  test('isNumber', () => {
    expect(utils.isNumber(0)).toEqual(true);
    expect(utils.isNumber(10e13)).toEqual(true);
    expect(utils.isNumber(false)).toEqual(false);
    expect(utils.isNumber('string')).toEqual(false);
    expect(utils.isNumber(function(){})).toEqual(false);
    expect(utils.isNumber({})).toEqual(false);
    expect(utils.isNumber([])).toEqual(false);
  });
  test('isPrimitive', () => {
    expect(utils.isPrimitive(0)).toEqual(true);
    expect(utils.isPrimitive(false)).toEqual(true);
    expect(utils.isPrimitive('string')).toEqual(true);
    expect(utils.isPrimitive(function(){})).toEqual(false);
    expect(utils.isPrimitive({})).toEqual(false);
    expect(utils.isPrimitive([])).toEqual(false);
  });
  test('newOfType', () => {
    function CustomClass(){};
    expect(utils.newOfType([])).toBeInstanceOf(Array);
    expect(typeof utils.newOfType(false) === 'boolean').toEqual(true);
    expect(typeof utils.newOfType('string') === 'string').toEqual(true);
    expect(utils.newOfType(function(){})).toBeInstanceOf(Function);
    expect(utils.newOfType(new CustomClass()).constructor.name).toEqual('CustomClass');
  });
  test('toObject', () => {
    expect(utils.toObject(0)).toMatchObject({});
    expect(utils.toObject(false)).toMatchObject({});
    expect(utils.toObject('string')).toMatchObject({});
    expect(utils.toObject({ test: true })).toMatchObject({ test: true });
    expect(utils.toObject(['one', 'two']))
      .toEqual(expect.arrayContaining(['one', 'two']));
  });
  test('toArray', () => {
    expect(utils.toArray(0))
      .toEqual(expect.arrayContaining([0]));
    expect(utils.toArray('test'))
      .toEqual(expect.arrayContaining(['t', 'e', 's', 't']));
    expect(utils.toArray(false))
      .toEqual(expect.arrayContaining([false]));
    expect(utils.toArray({ test: true }))
      .toEqual(expect.arrayContaining([true]));
    expect(utils.toArray(['one', 'two']))
      .toEqual(expect.arrayContaining(['one', 'two']));
  });
  // test('map', () => {

  // });
  // test('reduce', () => {

  // });
  // test('filter', () => {});
  // test('contains', () => {});
  test('relativePathValue', () => {
    const data = {
      users: [
        { name: { first: 'Joe', last: 'Doe' } }
      ]
    };

    const obj = {
      ...data,
      users: {
        ['../']: data,
        '0': {
          ['../']: { ['../']: data, ...data.users },
          ...data.users[0],
          name: {
            ['../']: { ['../']: { ['../']: data, ...data.users }, ...data.users[0] },
            ...data.users[0].name
          }
        }
      }
    };

    expect(utils.relativePathValue(obj.users[0].name, '../../../users')).toBeInstanceOf(Array);
  });
  // test('get', () => {});
  // test('resolveRelativePath', () => {});
  // test('getValFromEither', () => {});
  // test('mergeMax', () => {});
  // test('reduceWith', () => {});
  // test('reduceAnd', () => {});
  // test('reduceOr', () => {});
});