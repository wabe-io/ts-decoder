import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

export const nullable = <T>(decoder: Decoder<T>): Decoder<T | null> => value => {
  if (value === null) {
    return value;
  }
  return decoder(value);
}

export const optional = <T>(decoder: Decoder<T>): Decoder<T | undefined> => value => {
  if (value === undefined) {
    return undefined;
  }
  return decoder(value);
}

export const nullish = <T>(decoder: Decoder<T>): Decoder<T | undefined | null> => value => {
  if (value === undefined
    || value === null) {
    return value;
  }
  return decoder(value);
}

export const decodeNumber: Decoder<number> = value => {
  if (typeof value !== 'number') {
    throw new DecodeError('Field is not a valid number');
  }
  return value;
}

export const decodeForcedNumber: Decoder<number> = value => {
  if (typeof value !== 'number') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new DecodeError('Field is not a valid number');
    }
    return parsed;      
  }

  return value;
}

export const decodeString: Decoder<string> = value => {
  if (typeof value !== 'string') {
    throw new DecodeError('Field is not a valid string');
  }

  return value;
};

export const decodeForcedString: Decoder<string> = value => {
  if (typeof value !== 'string') {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }

  return value;
};

export const decodeBoolean: Decoder<boolean> = value => {
  if (typeof value !== 'boolean') {
    throw new DecodeError('Field is not a valid boolean');
  }

  return value;
};

export const decodeForcedBoolean: Decoder<boolean> = value => {
  if (typeof value !== 'boolean') {
    const strval = String(value).toLowerCase();
    if (strval === 'true') {
      return true;
    }

    if (strval === 'false' || strval === '0') {
      return false;
    }

    return !!value;
  }

  return value;
};

export const decodeDate: Decoder<Date> = value => {
  if (!(value instanceof Date)) {
    throw new DecodeError('Field is not a Date object');
  }

  return value;
};

export const decodeForcedDate: Decoder<Date> = value => {
  if (!(value instanceof Date)) {
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

  return value;
};
