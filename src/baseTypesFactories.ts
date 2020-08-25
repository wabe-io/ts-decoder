import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { DecodeOptions } from './decodeOptions';
import { DecodeArrayOptions } from './decodeArrayOptions';

/**
 * Test DecodeOptions against a given value.
 * @param value The value to check
 * @param options Options to test
 * @throws a {@link DecoderError} if the value is incompatible with the options
 * @returns True if value should be returned as is
 */
export const testOptions = (value: any, options?: DecodeOptions): boolean => {
  if (value === undefined) {
    if (options?.optional) {
      return true;
    }

    if (options?.force) {
      return false;
    }

    throw new DecodeError('Field is required but not present');
  }

  if (value === null) {
    if (options?.nullable) {
      return true;
    }

    if (options?.force) {
      return false;
    }

    throw new DecodeError('Field is null but no nullable was specified');
  }

  return false;
};

export const numberDecoderFactory = (options?: DecodeOptions): Decoder<number> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  if (typeof value !== 'number') {
    if (options?.force) {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        throw new DecodeError('Field is not a valid number');
      }
      return parsed;      
    }

    throw new DecodeError('Field is not a valid number');
  }

  return value;
};

export const stringDecoderFactory = (options?: DecodeOptions): Decoder<string> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  if (typeof value !== 'string') {
    if (options?.force) {
      if (value instanceof Date) {
        return value.toISOString();
      }
  
      return String(value);    
    }
  
    throw new DecodeError('Field is not a valid string');
  }

  return value;
};

export const booleanDecoderFactory = (options?: DecodeOptions): Decoder<boolean> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  if (typeof value !== 'boolean') {
    if (options?.force) {
      const strval = String(value).toLowerCase();
      if (strval === 'true') {
        return true;
      }
  
      if (strval === 'false' || strval === '0') {
        return false;
      }
  
      return !!value;    
    }
  
    throw new DecodeError('Field is not a valid boolean');
  }

  return value;
};

export const dateDecoderFactory = (options?: DecodeOptions): Decoder<Date> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  if (!(value instanceof Date)) {
    if (options?.force) {
      let date = new Date(value);
      if (!(date instanceof Date)
        || isNaN(date as any as number)) {

        // Try parsing the input as number
        date = new Date(parseInt(value));

        if (!(date instanceof Date)
        || isNaN(date as any as number)) {
          throw new DecodeError('Field is not a valid ISO or timestamp date');
        }
      }

      return date;
    }

    throw new DecodeError('Field is not a Date object');
  }

  return value;
}

/**
 * Checks whether an object is an iterable
 * @param obj Object to be evaluated as iterable
 */
const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function';

export const arrayDecoderFactory = <T>(itemDecoder: Decoder<T>, options?: DecodeArrayOptions): Decoder<T[]> => value => {
  if (testOptions(value, options)) {
    return value;
  }

  let array: any[];

  if (Array.isArray(value)) {
    array = value;
  } else  if (isIterable(value)) {
    array = Array.from(value);
  } else {
    throw new DecodeError('Field is not an array or iterable');
  }

  return array.map((item: any) => {
    try {
      return itemDecoder(item);
    } catch (e) {
      if (options?.requireAll || !DecodeError.isDecodeError(e)) {
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
