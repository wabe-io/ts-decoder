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

export enum PropertyTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
}

export const parseProperty = (source: any, entityName: string) => (name: string, type: PropertyTypes, options?: DecodeOptions): any => {
  if (typeof source !== 'object' || Array.isArray(source)) {
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
