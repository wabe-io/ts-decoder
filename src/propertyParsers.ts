import { DecodeError } from './decodeError';
import { Decoder } from './decoder';
import { DecodeOptions } from './decodeOptions';
import { DecodeArrayOptions } from './decodeArrayOptions';
import {
  decodeNumber,
  decodeString,
  decodeBoolean,
  decodeDate,
} from './baseDecoders';
import { decodeArray } from './decodeArray';
import { testDecodeOptions } from './testDecodeOptions';

export enum PropertyTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
}

const isObjectLike = (value: any) => typeof value === 'object' && !Array.isArray(value);

export const parseProperty2 = (source: any, entityName: string) => (name: string, type: PropertyTypes, options?: DecodeOptions): any => {
  if (!isObjectLike(source)) {
    throw new DecodeError(`Can't convert source ${entityName} to object`);
  }

  try {
    const value = source[name];

    switch (type) {
      case PropertyTypes.String:
        return decodeString(options)(value);
      case PropertyTypes.Boolean:
        return decodeBoolean(options)(value);
      case PropertyTypes.Number:
        return decodeNumber(options)(value);
      case PropertyTypes.Date:
        return decodeDate(options)(value);
      default:
        throw new DecodeError(`Unknow field type ${type} for ${entityName}.${name}.`);
    }
  } catch (e) {
    if (DecodeError.isDecodeError(e)) {
      throw new DecodeError(`Error in ${entityName}.${name}. Data: ${JSON.stringify(source)}`, e);
    }
    throw new DecodeError(`Uknown error in ${entityName}.${name}. }. Data: ${JSON.stringify(source)}. Error: ${e}`);
  }
};

export const parseArrayField = (
  source: any,
  entityName: string,
) => <T>(
  name: string,
  itemDecoder: Decoder<T>,
  options?: DecodeArrayOptions,
): T[] => {
  if (typeof source !== 'object' || Array.isArray(source)) {
    throw new DecodeError(`Can't convert source ${entityName} to object`);
  }

  try {
    const value = source[name];

    return decodeArray<T>(itemDecoder, options)(value);
  } catch (e) {
    if (DecodeError.isDecodeError(e)) {
      throw new DecodeError(`Error in ${entityName}.${name}}. Data: ${JSON.stringify(source)}`, e);
    }
    throw new DecodeError(`Uknown error in ${entityName}.${name}. }. Data: ${JSON.stringify(source)}. Error: ${e}`);
  }
};

export type PropertyDecoderHelper = <F>(name: string, decoder: Decoder<F>) => F;

export const decodeProperty =  <T>(source: { [key: string]: any }, entityName: string): PropertyDecoderHelper => (name, decoder) => {
  if (!isObjectLike(source)) {
    throw new DecodeError(`Can't convert source ${entityName} to object`);
  }

  try {
    const value = source[name];
    return decoder(value);
  } catch (e) {
    if (DecodeError.isDecodeError(e)) {
      throw new DecodeError(`Error in ${entityName}.${name}. Data: ${JSON.stringify(source)}`, e);
    }
    throw new DecodeError(`Uknown error in ${entityName}.${name}. }. Data: ${JSON.stringify(source)}. Error: ${e}`);
  }
};


export const decodeObject = <T>(entityName: string, callback: (property: PropertyDecoderHelper) => T, options?: DecodeOptions): Decoder<T> => input => {
  if (testDecodeOptions(input, options)) {
    return input;
  }

  if (!isObjectLike(input)) {
    throw new DecodeError(`Can't convert input ${entityName} to object`);
  }


  return callback(decodeProperty(input, entityName));
}