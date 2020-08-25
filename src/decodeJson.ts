import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { DecodeOptions } from './decodeOptions';
import { testDecodeOptions } from './testDecodeOptions';

export const fromJson = <T>(objectDecoder: Decoder<T>, options?: DecodeOptions): Decoder<T> => stringInput => {
  if (testDecodeOptions(stringInput, options)) {
    return stringInput;
  }

  try {
    const obj = JSON.parse(stringInput);

    return objectDecoder(obj);
  } catch (e) {
    throw new DecodeError(
      `Can't parse input json: ${e}`,
      DecodeError.isDecodeError(e) ? e : undefined,
    );
  }
};
