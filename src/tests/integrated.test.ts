import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import {
  fromJson,
  decodeObject,
  decodeNumber,
  decodeArray,
  decodeBoolean,
  decodeForcedDate,
  decodeString,
  optional,
} from '..';

chai.use(chaidt);
const expect = chai.expect;

describe('module', () => {
  it('can decode a simple json document', () => {
    type MockObj = {
      someNumber: number;
      someString: string;
      someBoolean: boolean;
      someDate: Date;
      someArray: number[];
    };
    const originalObj: MockObj = {
      someNumber: 1,
      someString: 'someStringxxx',
      someBoolean: true,
      someDate: new Date(),
      someArray: [1,2,3],
    };
    const json = JSON.stringify(originalObj);
    const decodeMock = decodeObject<MockObj>('MockEntity', properties => ({
      someNumber: properties('someNumber', decodeNumber),
      someString: properties('someString', decodeString),
      someBoolean: properties('someBoolean', decodeBoolean),
      someDate: properties('someDate', decodeForcedDate),
      someArray: properties('someArray', decodeArray(decodeNumber)),
    }));
    const decoded = fromJson(decodeMock)(json);
    expect(decoded).to.be.eql(originalObj);
  });

  it('can decode an optional array', () => {
    const array = [1,2,3];
    const decoded = optional(decodeArray(decodeNumber))(array);
    expect(decoded).to.eql(array);
  });
});