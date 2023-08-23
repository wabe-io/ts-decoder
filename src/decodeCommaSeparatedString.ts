import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

export const decodeCommaSeparatedString: Decoder<string[]> = (
  input: unknown,
) => {
  if (typeof input !== 'string') {
    throw new DecodeError('Input is not a string');
  }

  return input.split(',');
};
