import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

const isObjectLike = (value: any) => typeof value === 'object' && !Array.isArray(value) && value != null;

export type PropertyGetter = (key: string) => (input: any) => any;

export type PropertyDecoderHelper = <F>(nameOrKey: string, decoder: Decoder<F>, getter?: PropertyGetter) => F;

export const decodeProperty = (source: { [key: string]: any }, entityName: string): PropertyDecoderHelper => (nameOrKey, decoder, getter?: PropertyGetter) => {
  if (!isObjectLike(source)) {
    throw new DecodeError(`Can't convert source ${entityName} to object`);
  }

  try {
    const value = getter != null ? getter(nameOrKey)(source) : source[nameOrKey];
    return decoder(value);
  } catch (e) {
    if (DecodeError.isDecodeError(e)) {
      throw new DecodeError(`Error in ${entityName}.${nameOrKey}. Data: ${JSON.stringify(source)}`, e);
    }
    throw new DecodeError(`Uknown error in ${entityName}.${nameOrKey}. }. Data: ${JSON.stringify(source)}. Error: ${e}`);
  }
};

export const decodeObject = <T>(entityName: string, callback: (property: PropertyDecoderHelper) => T): Decoder<T> => input => {
  if (!isObjectLike(input)) {
    throw new DecodeError(`Can't convert input ${entityName} to object`);
  }

  return callback(decodeProperty(input, entityName));
};
