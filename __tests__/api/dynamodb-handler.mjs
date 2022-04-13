import { toTableName, toAttributeName } from '../../api/dynamodb-handler.mjs';
import { RESERVED_NAMES } from '../../api/dynamodb-const.mjs';
import _ from 'lodash';

describe('toTableName', () => {
  test('always lowercase', () => {
    expect(toTableName('CAPITALIZED')).toBe('capitalized');
  });
  test('expressed in kebab case', () => {
    expect(toTableName('Make Kebab Case')).toBe('make-kebab-case');
    expect(toTableName('MakeKebabCase')).toBe('make-kebab-case');
    expect(toTableName('makeKebabCase')).toBe('make-kebab-case');
  });
  test('"_" and "." are converted to "-"', () => {
    expect(toTableName('Make_Kebab_Case')).toBe('make-kebab-case');
    expect(toTableName('Make.Kebab.Case')).toBe('make-kebab-case');
  });
  test('numbers are retained', () => {
    expect(toTableName('Make_123_Case')).toBe('make-123-case');
    expect(toTableName('123.Kebab.Case')).toBe('123-kebab-case');
  });
  test('invalid characters are converted to "-"', () => {
    expect(toTableName('Make#Kebab$Case')).toBe('make-kebab-case');
  });
});

// describe('toAttributeName', () => {
//   test('always lowercase', () => {
//     expect(toAttributeName('CAPITALIZED')).toBe('capitalized');
//   });
//   test('expressed in kebab case', () => {
//     expect(toAttributeName('Make Kebab Case')).toBe('make-kebab-case');
//     expect(toAttributeName('MakeKebabCase')).toBe('make-kebab-case');
//     expect(toAttributeName('makeKebabCase')).toBe('make-kebab-case');
//   });
//   test('"#" and ":" are converted to "-"', () => {
//     expect(toAttributeName('Make#Kebab#Case')).toBe('make-kebab-case');
//     expect(toAttributeName('Make:Kebab:Case')).toBe('make-kebab-case');
//   });
//   test('numbers are retained', () => {
//     expect(toAttributeName('Make_123_Case')).toBe('make-123-case');
//     expect(toAttributeName('123.Kebab.Case')).toBe('123-kebab-case');
//   });
//   test('invalid characters are converted to "-"', () => {
//     expect(toAttributeName('Make!Kebab$Case')).toBe('make-kebab-case');
//   });
//   test.each(RESERVED_NAMES)('reserved name [%s] is prefixed with "_"', (name) => {
//     expect(toAttributeName(_.toUpper(name))).toBe(`_${_.kebabCase(name)}`);
//     expect(toAttributeName(_.toLower(name))).toBe(`_${_.kebabCase(name)}`);
//   });
// });