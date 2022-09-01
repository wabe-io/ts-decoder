import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

export const fromJson =
  <T>(objectDecoder: Decoder<T>): Decoder<T> =>
  (input) => {
    if (typeof input !== 'string') {
      throw new DecodeError('fromJson: input is not a string');
    }

    try {
      const obj = JSON.parse(input);

      return objectDecoder(obj);
    } catch (e) {
      throw new DecodeError(
        `Can't decode input json: ${e}`,
        DecodeError.isDecodeError(e) ? e : undefined,
      );
    }
  };
