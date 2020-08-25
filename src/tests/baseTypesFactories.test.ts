import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import {
  testOptions,
  numberDecoderFactory,
  stringDecoderFactory,
  booleanDecoderFactory,
  dateDecoderFactory,
  arrayDecoderFactory,
} from '../baseTypesFactories';
import { DecodeError } from '../decodeError';
import { Decoder } from '../decoder';

chai.use(chaidt);
const expect = chai.expect;

describe('testOptions', () => {
  it('returns true if value supplied is null and options allow null', () => {
    const result = testOptions(null, { nullable: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is null and options allow null (with force=true)', () => {
    const result = testOptions(null, { nullable: true, force: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is undefined and options allow optional', () => {
    const result = testOptions(undefined, { optional: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is undefined and options allow optional (with force=true)', () => {
    const result = testOptions(undefined, { optional: true, force: true });
    expect(result).to.be.true;
  });

  it('returns false if value supplied is null and options do not allow null but force is true', () => {
    const result = testOptions(null, { force: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is null and options do not allow null but force is true (and optional is true)', () => {
    const result = testOptions(null, { force: true, optional: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is undefined and options do not allow optional but force is true', () => {
    const result = testOptions(undefined, { force: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is undefined and options do not allow optional but force is true (and nullable is true)', () => {
    const result = testOptions(undefined, { force: true, nullable: true });
    expect(result).to.be.false;
  });

  it('throws an error if value supplied is null', () => {
    const fn = () => {
      testOptions(null);
    }
    expect(fn).to.throw();
  });

  it('throws an error if value supplied is undefined', () => {
    const fn = () => {
      testOptions(undefined);
    }
    expect(fn).to.throw();
  });
});

describe('numberDecoderFactory', () => {
  it('can decode a number', () => {
    expect(numberDecoderFactory()(5)).to.equal(5);
  });

  it('can decode a float', () => {
    const x = 0.4;
    expect(numberDecoderFactory()(x)).to.equal(x);
  });

  it('can force decode a number', () => {
    expect(numberDecoderFactory({ force: true })('5')).to.equal(5);
  });

  it('can force decode a float', () => {
    expect(numberDecoderFactory({ force: true })('5.5')).to.equal(5.5);
  });

  it('can decode an optional value', () => {
    expect(numberDecoderFactory({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(numberDecoderFactory({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(numberDecoderFactory({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(numberDecoderFactory({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an string', () => {
    expect(() => { numberDecoderFactory()('0')}).to.throw();
  });

  it('throws when decoding an optional value', () => {
    expect(() => { numberDecoderFactory()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { numberDecoderFactory()(null)}).to.throw();
  });

  it('throws when force decoding a non-numeric value', () => {
    expect(() => { numberDecoderFactory({ force: true })('')}).to.throw();
  });

  it('throws when force decoding a null value', () => {
    expect(() => { numberDecoderFactory({ force: true })(null)}).to.throw();
  });

  it('throws when force decoding an undefined value', () => {
    expect(() => { numberDecoderFactory({ force: true })(undefined)}).to.throw();
  });
});

describe('stringDecoderFactory', () => {
  it('can decode a string', () => {
    const str = 'The string';
    expect(stringDecoderFactory()(str)).to.equal('The string');
  });

  it('can force decode a number', () => {
    expect(stringDecoderFactory({ force: true })(5)).to.equal('5');
  });

  it('can force decode a boolean', () => {
    expect(stringDecoderFactory({ force: true })(true)).to.equal('true');
  });

  it('can force decode a null value', () => {
    expect(stringDecoderFactory({ force: true })(null)).to.equal('null');
  });

  it('can force decode an undefined value', () => {
    expect(stringDecoderFactory({ force: true })(undefined)).to.equal('undefined');
  });

  it('can force decode a date using ISO format', () => {
    const now = new Date();
    expect(stringDecoderFactory({ force: true })(now)).to.equal(now.toISOString());
  });

  it('can decode an optional value', () => {
    expect(stringDecoderFactory({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(stringDecoderFactory({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(stringDecoderFactory({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(stringDecoderFactory({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an optional value', () => {
    expect(() => { stringDecoderFactory()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { stringDecoderFactory()(null)}).to.throw();
  });
});

describe('booleanDecoderFactory', () => {
  it('can decode a truth', () => {
    expect(booleanDecoderFactory()(true)).to.be.true;
  });

  it('can force decode a false', () => {
    expect(booleanDecoderFactory()(false)).to.be.false;
  });

  it('can decode an optional value', () => {
    expect(booleanDecoderFactory({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(booleanDecoderFactory({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(booleanDecoderFactory({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(booleanDecoderFactory({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an optional value', () => {
    expect(() => { booleanDecoderFactory()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { booleanDecoderFactory()(null)}).to.throw();
  });

  it('can force decode a lowercase string', () => {
    expect(booleanDecoderFactory({ force: true })('true')).to.be.true;
    expect(booleanDecoderFactory({ force: true })('false')).to.be.false;
  });

  it('can force decode a mixed case string', () => {
    expect(booleanDecoderFactory({ force: true })('TrUe')).to.be.true;
    expect(booleanDecoderFactory({ force: true })('FalSe')).to.be.false;
  });

  it('can force decode null as false', () => {
    expect(booleanDecoderFactory({ force: true })(null)).to.be.false;
  });

  it('can force decode undefined as false', () => {
    expect(booleanDecoderFactory({ force: true })(undefined)).to.be.false;
  });

  it('can force decode "1" as true', () => {
    expect(booleanDecoderFactory({ force: true })('1')).to.be.true;
  });

  it('can force decode 1 as true', () => {
    expect(booleanDecoderFactory({ force: true })(1)).to.be.true;
  });

  it('can force decode "0" as false', () => {
    expect(booleanDecoderFactory({ force: true })('0')).to.be.false;
  });

  it('can force decode 0 as false', () => {
    expect(booleanDecoderFactory({ force: true })(0)).to.be.false;
  });

  it('can force decode 111 as true', () => {
    expect(booleanDecoderFactory({ force: true })(111)).to.be.true;
  });

  it('can force decode "" as false', () => {
    expect(booleanDecoderFactory({ force: true })('')).to.be.false;
  });

  it('can force decode "xxx" as true', () => {
    expect(booleanDecoderFactory({ force: true })('xxx')).to.be.true;
  });

  it('can force decode {} as true', () => {
    expect(booleanDecoderFactory({ force: true })({})).to.be.true;
  });
});

describe('dateDecoderFactory', () => {
  it('can decode a date', () => {
    const now = new Date();
    expect(dateDecoderFactory()(now)).to.equalDate(now);
  });

  it('can force decode an ISO date', () => {
    const now = new Date();
    expect(dateDecoderFactory({ force: true })(now.toISOString())).to.equalDate(now);
  });

  it('can force decode a string date', () => {
    const now = new Date();
    expect(dateDecoderFactory({ force: true })(String(now))).to.equalDate(now);
  });

  it('can force decode basic a string date', () => {
    const strDate = '2020/01/01';
    expect(dateDecoderFactory({ force: true })(strDate)).to.equalDate(new Date(strDate));
  });

  it('can force decode a numeric Unix timestamp', () => {
    const now = new Date();
    expect(dateDecoderFactory({ force: true })(now.getTime())).to.equalDate(now);
  });

  it('can force decode a string Unix timestamp', () => {
    const now = new Date();
    expect(dateDecoderFactory({ force: true })(String(now.getTime()))).to.equalDate(now);
  });

  it('can decode an optional value', () => {
    expect(dateDecoderFactory({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(dateDecoderFactory({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(dateDecoderFactory({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(dateDecoderFactory({ nullable: true, force: true })(null)).to.be.null;
  });
});

describe('arrayDecoderFactory', () => {
  it('can decode an homogeneous array', () => {
    const mockDecoder = (input: number) => input;
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder);
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
            return {
              done: v == null,
              value: v,
            };
          },
        };
      },
    }

    const mockDecoder = (input: number) => input;
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder);
    expect(numberArrayDecoder(iterable)).to.include.ordered.members([1,2,3,4]);
  });

  it('can decode an homogeneous array requiring all', () => {
    const mockDecoder: Decoder<number> = input => input;
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder, { requireAll: true });
    const testArray = [1,2,3,4];
    expect(numberArrayDecoder(testArray)).to.include.ordered.members(testArray);
  });

  it('fails to decode an array if one element fails', () => {
    const mockDecoder: Decoder<number> = () => {
      throw new Error();
    };
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder, { requireAll: true });
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
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder, { requireAll: false });
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
    const numberArrayDecoder = arrayDecoderFactory(mockDecoder, { requireAll: false, errorCollector: i => errors.push(i) });
    const testArray = [1,2,3,4];
    numberArrayDecoder(testArray);
    expect(errors.length).to.equal(4);
  });

  it('will not collect non decoding errors', () => {
    // Decoder fails with odd numbers
    const mockDecoder: Decoder<number> = () => {
      throw new Error();
    };
    expect(() => { arrayDecoderFactory(mockDecoder, { requireAll: false, errorCollector: i => {} })([1]) }).to.throw();
  });

  it('can decode an optional value', () => {
    const mockDecoder: Decoder<number> = input => input;
    expect(arrayDecoderFactory(mockDecoder, { optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an null value', () => {
    const mockDecoder: Decoder<number> = input => input;
    expect(arrayDecoderFactory(mockDecoder, { nullable: true })(null)).to.be.null;
  });
});




