import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

export const decodeJson = <T>(stringInput: string, decoder: Decoder<T>): T => {
  try {
    const obj = JSON.parse(stringInput);

    return decoder(obj);
  } catch (e) {
    throw new DecodeError(
      `Can't parse input json: ${e}`,
      DecodeError.isDecodeError(e) ? e : undefined,
    );
  }
};
