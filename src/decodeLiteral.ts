import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

export const decodeLiteral = <T>(value: T): Decoder<T> => input => {
  if (input !== value) {
    throw new DecodeError('Value provide does not match literal`');
  }

  return input;
};

export const matchingLiteral = <T>(value: T, decoder: Decoder<any>): Decoder<T> => input => {
  const decoded = decoder(input);

  if (input !== decoded) {
    throw new DecodeError('Value provide does not match literal`');
  }

  return decoded;
}

export const decodeLiteralUnion = <T>(values: T[]): Decoder<T> => input => {
  for (const value of values) {
    if (value === input) {
      return value;
    }
  }
  throw new DecodeError('Provided value was not in the list of possible literals');
};

export const matchingLiteralUnion = <T>(values: T[], decoder: Decoder<any>): Decoder<T> => input => {
  const decoded = decoder(input);

  for (const value of values) {
    if (decoded === value) {
      return decoded;
    }
  }

  throw new DecodeError('Provided value was not in the list of possible literals');
};
