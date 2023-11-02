import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

const isObjectLike = (value: any) =>
  typeof value === 'object' && !Array.isArray(value) && value != null;

type PropertyGetter = (input: any, fieldName: string) => any;

export const literalGetter: PropertyGetter = (input, fieldName) =>
  input[fieldName];

export const nestedGetter: PropertyGetter = (input, fieldName) => {
  if (fieldName.includes('.')) {
    const parts = fieldName.split('.');
    let val = input;
    for (const part of parts) {
      val = val[part];
    }
    return val;
  } else {
    return input[fieldName];
  }
};

type PropertyDecoderHelper = <F>(
  propertyName: string,
  decoder: Decoder<F>,
  getter?: PropertyGetter,
) => F;

const decodeProperty =
  (source: { [key: string]: any }, entityName: string): PropertyDecoderHelper =>
  (propertyName: string, decoder, getter: PropertyGetter = nestedGetter) => {
    if (!isObjectLike(source)) {
      throw new DecodeError(`Can't convert source ${entityName} to object`);
    }

    try {
      const value = getter(source, propertyName);
      return decoder(value);
    } catch (e) {
      if (DecodeError.isDecodeError(e)) {
        throw new DecodeError(
          `Error in ${entityName}.${propertyName}. Data: ${JSON.stringify(
            source,
          )}`,
          e,
        );
      }
      throw new DecodeError(
        `Uknown error in ${entityName}.${propertyName}. }. Data: ${JSON.stringify(
          source,
        )}. Error: ${e}`,
      );
    }
  };

export const decodeObject =
  <T>(
    entityName: string,
    callback: (property: PropertyDecoderHelper) => T,
  ): Decoder<T> =>
  (input) => {
    if (!isObjectLike(input)) {
      throw new DecodeError(`Can't convert input ${entityName} to object`);
    }

    return callback(decodeProperty(input, entityName));
  };
