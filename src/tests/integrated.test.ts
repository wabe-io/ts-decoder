import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import { path } from 'ramda';
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

  it('can decode an object using a path', () => {
    const value = 'DSADS';
    const data = {
      a: [
        {},
        {
          b: {
            x: value,
          },
        },
      ],
    };
    type Data = { x: string };
    const decoded = decodeObject<Data>('', prop => ({
      x: prop('', decodeString, path(['a', '1', 'b', 'x'])),
    }))(data);
    expect(decoded.x).to.equal(value);
  });
});

