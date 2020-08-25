import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { DecodeOptions } from './decodeOptions';
import { testOptions } from './baseTypesFactories';

export const fromJson = <T>(objectDecoder: Decoder<T>, options?: DecodeOptions): Decoder<T> => stringInput => {
  if (testOptions(stringInput, options)) {
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
