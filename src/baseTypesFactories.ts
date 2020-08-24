import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { ParsePropertyOptions, ParseArrayOptions } from './parsePropertyOptions';

/**
 * Test ParsePropertyOptions against a given value.
 * @param value The value to check
 * @param options Options to test
 * @throws a {@link DecoderError} if the value is incompatible with the options
 * @returns True if value should be returned as is
 */
const testOptions = (value: any, options?: ParsePropertyOptions): boolean => {
  if (value === undefined && !options?.optional && !options?.force) {
    throw new DecodeError('Field is required but not present');
  }

  if (value === null && !options?.nullable && !options?.force) {
    throw new DecodeError('Field is null but no nullable was specified');
  }

  return !options?.force && value == null;
};

export const numberDecoderFactory = (options?: ParsePropertyOptions): Decoder<number> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  if (!options?.force && typeof value !== 'number') {
    console.log({ options });
    throw new DecodeError('Field is not a valid number');
  }

  if (options?.force) {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new DecodeError('Field is not a valid number');
    }
    return parsed;
  } else {
    return value;
  }
};

export const stringDecoderFactory = (options?: ParsePropertyOptions): Decoder<string> => value => {
  if (testOptions(value, options)) {
    return value;
  } 
  
  const force = !!options?.force;
  if (!force && typeof value !== 'string') {
    throw new DecodeError('Field is not a valid string');
  }

  if (force) {
    return String(value);
  }

  return value;
};

export const booleanDecoderFactory = (options?: ParsePropertyOptions): Decoder<boolean> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  const force = !!options?.force;
  if (!force && typeof value !== 'boolean') {
    throw new DecodeError('Field is not a valid boolean');
  }

  if (force) {
    const strval = String(value);
    if (strval === 'false' || strval === 'true') {
      return strval === 'true';
    }
    return  !!value;
  }

  return value;
};

export const dateDecoderFactory = (options?: ParsePropertyOptions): Decoder<Date> => value => {
  if (!testOptions(value, options) && typeof value !== 'string' && typeof value !== 'number') {
    throw new DecodeError('Field is not a valid ISO or timestamp date');
  }
  let date = new Date(value);
  if (!(date instanceof Date)
    || isNaN(date as any as number)) {
    throw new DecodeError('Field is not a valid ISO or timestamp date');
  }
  return date;
}

/**
 * Checks whether an object is an iterable
 * @param obj Object to be evaluated as iterable
 */
const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function';

export const arrayDecoderFactory = <T>(itemDecoder: Decoder<T>, options?: ParseArrayOptions): Decoder<T[]> => value => {
  // Must be an array 
  if (!testOptions(value, options) && !Array.isArray(value)) {
    throw new DecodeError('Field is not an array');
  }

  return value.map((item: any) => {
    try {
      return itemDecoder(item);
    } catch (e) {
      if (!!options?.requireAll || !DecodeError.isDecodeError(e)) {
        throw e;
      }

      // This 'swallows' the exception. So we collect the error instead
      const collector = options?.errorCollector;
      collector && collector(e);

      return e;
    }
  })
    .filter((item: T | DecodeError) => !DecodeError.isDecodeError(item));
};
