import { DecodeOptions } from './decodeOptions';
import { DecodeError } from './decodeError';

/**
 * Test DecodeOptions against a given value.
 * @param value The value to check
 * @param options Options to test
 * @throws a {@link DecoderError} if the value is incompatible with the options
 * @returns True if value should be returned as is
 */
export const testDecodeOptions = (value: any, options?: DecodeOptions): boolean => {
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
