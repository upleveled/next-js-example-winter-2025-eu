import { expect, test } from '@jest/globals';
import { formatDate, getDaysUntilNextBirthDay } from '../date';

test('format date correctly for different locales and formats', () => {
  expect(formatDate(new Date('2024-02-07'))).toBe('07/02/2024');
  expect(formatDate(new Date('2024-02-07'), 'en-US')).toBe('02/07/2024');

  expect(
    formatDate(new Date('2024-02-07'), 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  ).toBe('February 7, 2024');

  expect(
    formatDate(new Date('2024-02-07'), 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  ).toBe('7. Februar 2024');
});

test('format date handles leap years correctly', () => {
  expect(formatDate(new Date('2024-02-29'))).toBe('29/02/2024'); // Leap year
  expect(formatDate(new Date('2025-02-29'))).toBe('01/03/2025'); // Not a leap year, should roll over
});

test('throws an error when formatDate is given invalid inputs', () => {
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate(false)).toThrow('Pass only dates!');
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate(null)).toThrow('Pass only dates!');
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate(undefined)).toThrow('Pass only dates!');
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate('2024-02-07')).toThrow('Pass only dates!');
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate(1700000000000)).toThrow('Pass only dates!');
  // @ts-expect-error Test for invalid parameter type
  expect(() => formatDate({})).toThrow('Pass only dates!');
});

test('calculate days until next birthday correctly', () => {
  expect(
    getDaysUntilNextBirthDay(new Date('2024-02-08'), new Date('1999-02-07')),
  ).toBe(365); // Birthday was yesterday, so it's in one year

  expect(
    getDaysUntilNextBirthDay(new Date('2024-02-07'), new Date('2004-02-07')),
  ).toBe(0); // Birthday is today, so it should return 0

  expect(
    getDaysUntilNextBirthDay(new Date('2024-06-01'), new Date('2001-02-07')),
  ).toBe(251); // Birthday is in the past but within the same year

  expect(
    getDaysUntilNextBirthDay(new Date('2024-01-01'), new Date('1986-02-07')),
  ).toBe(37); // Birthday is in the future within the same year

  expect(
    getDaysUntilNextBirthDay(new Date('2024-02-28'), new Date('1992-02-29')),
  ).toBe(1); // Leap year birthday, one day away
});

test('throws an error when getDaysUntilNextBirthDay is given invalid inputs', () => {
  // @ts-expect-error Test for invalid parameter type
  expect(() => getDaysUntilNextBirthDay('123', new Date('2024-02-07'))).toThrow(
    'Pass only dates!',
  );

  // @ts-expect-error Test for invalid parameter type
  expect(() => getDaysUntilNextBirthDay(null, new Date('2024-02-07'))).toThrow(
    'Pass only dates!',
  );

  expect(() =>
    // @ts-expect-error Test for invalid parameter type
    getDaysUntilNextBirthDay(undefined, new Date('2024-02-07')),
  ).toThrow('Pass only dates!');

  // @ts-expect-error Test for invalid parameter type
  expect(() => getDaysUntilNextBirthDay(new Date('2024-02-07'), {})).toThrow(
    'Pass only dates!',
  );

  // @ts-expect-error Test for invalid parameter type
  expect(() => getDaysUntilNextBirthDay(new Date('2024-02-07'), [])).toThrow(
    'Pass only dates!',
  );
});

test('throws an error when birth date is in the future', () => {
  expect(() =>
    getDaysUntilNextBirthDay(new Date('2024-02-07'), new Date('2025-02-07')),
  ).toThrow('Birth date must be before current date');
});
