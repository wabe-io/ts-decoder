import { Decoder } from './decoder';
import { DecodeArrayOptions } from './decodeArrayOptions';
import { DecodeError } from './decodeError';

/**
 * Checks whether an object is an iterable
 * @param obj Object to be evaluated as iterable
 */
const isIterable = (obj: any): boolean => obj != null && typeof obj[Symbol.iterator] === 'function';

export const decodeArray = <T>(itemDecoder: Decoder<T>, options?: DecodeArrayOptions): Decoder<T[]> => value => {
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
