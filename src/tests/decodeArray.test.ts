import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import { identity } from 'ramda';
import { decodeArray } from '../decodeArray';
import { DecodeError } from '../decodeError';
import { Decoder } from '../decoder';

chai.use(chaidt);
const expect = chai.expect;

describe('decodeArray', () => {
  it('can decode an homogeneous array', () => {
    const numberArrayDecoder = decodeArray(identity);
    const testArray = [1,2,3,4];
    expect(numberArrayDecoder(testArray)).to.include.ordered.members(testArray);
  });

  it('can decode a non-array iterable', () => {
    
    const iterable: Iterable<number> = {
      [Symbol.iterator]: () => {
        const a = [1,2,3,4];
        return {
          next: () => {
            const v = a.shift();

            if (v == null) {
              return { done: true, value: undefined };
            } else {
              return { value: v };
            }
          },
        };
      },
    }

    const numberArrayDecoder = decodeArray(identity);
    expect(numberArrayDecoder(iterable)).to.include.ordered.members([1,2,3,4]);
  });

  it('can decode an homogeneous array requiring all', () => {
    const numberArrayDecoder = decodeArray(identity, { requireAll: true });
    const testArray = [1,2,3,4];
    expect(numberArrayDecoder(testArray)).to.include.ordered.members(testArray);
  });

  it('fails to decode an array if one element fails', () => {
    const mockDecoder: Decoder<number> = () => {
      throw new Error();
    };
    const numberArrayDecoder = decodeArray(mockDecoder, { requireAll: true });
    const testArray = [1,2,3,4];

    expect(() => { numberArrayDecoder(testArray) }).to.throw();
  });

  it('can decode an homogeneous array with some failures', () => {
    // Decoder fails with odd numbers
    const mockDecoder: Decoder<number> = input => {
      if (input % 2 === 1) {
        throw new DecodeError('Number is odd');
      }
      return input;
    };
    const numberArrayDecoder = decodeArray(mockDecoder, { requireAll: false });
    const testArray = [1,2,3,4];
    const decodedArray = numberArrayDecoder(testArray);
    expect(decodedArray).to.include.members([2,4]);
    expect(decodedArray).to.not.include(1);
    expect(decodedArray).to.not.include(3);
  });

  it('can collect errors', () => {
    // Decoder fails with odd numbers
    const mockDecoder: Decoder<number> = () => {
      throw new DecodeError('Some message');
    };
    const errors: any[] = [];
    const numberArrayDecoder = decodeArray(mockDecoder, { requireAll: false, errorCollector: i => errors.push(i) });
    const testArray = [1,2,3,4];
    numberArrayDecoder(testArray);
    expect(errors.length).to.equal(4);
  });

  it('will not collect non decoding errors', () => {
    // Decoder fails with odd numbers
    const mockDecoder: Decoder<number> = () => {
      throw new Error();
    };
    expect(() => { decodeArray(mockDecoder, { requireAll: false, errorCollector: () => {} })([1]) }).to.throw();
  });

  it('throws when undefined supplied', () => {
    expect(() => { decodeArray(identity)(undefined) }).to.throw();
  });

  it('throws when null supplied', () => {
    expect(() => { decodeArray(identity)(null) }).to.throw();
  });
});




