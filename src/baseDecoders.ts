import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { DecodeOptions } from './decodeOptions';
import { testDecodeOptions } from './testDecodeOptions';

export const decodeNumber = (options?: DecodeOptions): Decoder<number> => value => {
  if (testDecodeOptions(value, options)) {
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

export const decodeString = (options?: DecodeOptions): Decoder<string> => value => {
  if (testDecodeOptions(value, options)) {
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

export const decodeBoolean = (options?: DecodeOptions): Decoder<boolean> => value => {
  if (testDecodeOptions(value, options)) {
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

export const decodeDate = (options?: DecodeOptions): Decoder<Date> => value => {
  if (testDecodeOptions(value, options)) {
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
