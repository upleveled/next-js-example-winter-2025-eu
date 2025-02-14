import { expect, test } from '@jest/globals';
import { formatDate, getDaysUntilNextBirthDay } from '../date';

test('format date correctly for different locales and formats', () => {
  expect(formatDate(new Date('2025-02-07'))).toBe('07/02/2025');

  expect(
    formatDate(new Date('2025-02-07'), 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  ).toBe('February 7, 2025');

  expect(
    formatDate(new Date('2025-02-07'), 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  ).toBe('7. Februar 2025');
});

test('throws an errorr when date is invalid', () => {
  // @ts-expect-error Test for invalid parameter types
  expect(() => formatDate(false)).toThrow('Pass only Dates!');
  // @ts-expect-error Test for invalid parameter types
  expect(() => formatDate(null)).toThrow('Pass only Dates!');
  // @ts-expect-error Test for invalid parameter types
  expect(() => formatDate('2024-02-07')).toThrow('Pass only Dates!');
  // @ts-expect-error Test for invalid parameter types
  expect(() => formatDate({})).toThrow('Pass only Dates!');
});

test('calculate days until the next birthday', () => {
  expect(
    getDaysUntilNextBirthDay(new Date('2025-02-14'), new Date('1999-02-13')),
  ).toBe(364);
  expect(
    getDaysUntilNextBirthDay(new Date('2025-02-14'), new Date('1999-02-14')),
  ).toBe(0);
  expect(
    getDaysUntilNextBirthDay(new Date('2025-01-01'), new Date('1999-02-14')),
  ).toBe(44);
});

test('throws an error when current date or birthdate is invalid', () => {
  expect(() =>
    // @ts-expect-error Test for invalid parameter types
    getDaysUntilNextBirthDay(undefined, new Date('1999-02-14')),
  ).toThrow('Pass only Dates!');
});

test('throws an error if birthdate is is in the future', () => {
  expect(() =>
    getDaysUntilNextBirthDay(new Date('1999-02-14'), new Date('2010-02-14')),
  ).toThrow('Birth date must be before current date!');
});
