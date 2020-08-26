import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import {
  decodeNumber,
  decodeForcedNumber,
  decodeString,
  decodeForcedString,
  decodeBoolean,
  decodeForcedBoolean,
  decodeDate,
  decodeForcedDate,
  nullable,
  optional,
  nullish,
} from '../baseDecoders';
import { Decoder } from '../decoder';

chai.use(chaidt);
const expect = chai.expect;

describe('nullable', () => {
  it('returns null if null is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(nullable(mockDecoder)(null)).to.be.null;
  });

  it('returns value if value is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(nullable(mockDecoder)(123)).to.be.equal(123);
  });
});

describe('optional', () => {
  it('returns undefined if undefined is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(optional(mockDecoder)(undefined)).to.be.undefined;
  });

  it('returns value if value is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(optional(mockDecoder)(123)).to.be.equal(123);
  });
});

describe('nullish', () => {
  it('returns undefined if undefined is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(nullish(mockDecoder)(undefined)).to.be.undefined;
  });

  it('returns null if null is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(nullish(mockDecoder)(null)).to.be.null;
  });

  it('returns value if value is provided', () => {
    const mockDecoder: Decoder<number> = () => 123;
    expect(nullish(mockDecoder)(123)).to.be.equal(123);
  });
});

describe('decodeNumber', () => {
  it('can decode a number', () => {
    expect(decodeNumber(5)).to.equal(5);
  });

  it('can decode a float', () => {
    const x = 0.4;
    expect(decodeNumber(x)).to.equal(x);
  });

  it('throws when decoding an string', () => {
    expect(() => { decodeNumber('0')}).to.throw();
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeNumber(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeNumber(null)}).to.throw();
  });
});

describe('decodeForcedNumber', () => {
  it('can decode a number', () => {
    expect(decodeForcedNumber(5)).to.equal(5);
  });

  it('can decode a float', () => {
    const x = 0.4;
    expect(decodeForcedNumber(x)).to.equal(x);
  });

  it('can force decode a number', () => {
    expect(decodeForcedNumber('5')).to.equal(5);
  });

  it('can force decode a float', () => {
    expect(decodeForcedNumber('5.5')).to.equal(5.5);
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeForcedNumber(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeForcedNumber(null)}).to.throw();
  });

  it('throws when force decoding a non-numeric value', () => {
    expect(() => { decodeForcedNumber('')}).to.throw();
  });
});

describe('decodeString', () => {
  it('can decode a string', () => {
    const str = 'The string';
    expect(decodeString(str)).to.equal('The string');
  });

  it('throws when decoding an non string', () => {
    expect(() => { decodeString(3)}).to.throw();
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeString(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeString(null)}).to.throw();
  });
});

describe('decodeForcedString', () => {
  it('can decode a string', () => {
    const str = 'The string';
    expect(decodeForcedString(str)).to.equal('The string');
  });

  it('can force decode a number', () => {
    expect(decodeForcedString(5)).to.equal('5');
  });

  it('can force decode a boolean', () => {
    expect(decodeForcedString(true)).to.equal('true');
  });

  it('can force decode a null value', () => {
    expect(decodeForcedString(null)).to.equal('null');
  });

  it('can force decode an undefined value', () => {
    expect(decodeForcedString(undefined)).to.equal('undefined');
  });

  it('can force decode a date using ISO format', () => {
    const now = new Date();
    expect(decodeForcedString(now)).to.equal(now.toISOString());
  });
});

describe('decodeBoolean', () => {
  it('can decode a truth', () => {
    expect(decodeBoolean(true)).to.be.true;
  });

  it('can force decode a false', () => {
    expect(decodeBoolean(false)).to.be.false;
  });

  it('throws when decoding an non boolean', () => {
    expect(() => { decodeBoolean(3)}).to.throw();
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeBoolean(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeBoolean(null)}).to.throw();
  });
});

describe('decodeForcedBoolean', () => {
  it('can decode a truth', () => {
    expect(decodeForcedBoolean(true)).to.be.true;
  });

  it('can force decode a false', () => {
    expect(decodeForcedBoolean(false)).to.be.false;
  });

  it('can force decode a lowercase string', () => {
    expect(decodeForcedBoolean('true')).to.be.true;
    expect(decodeForcedBoolean('false')).to.be.false;
  });

  it('can force decode a mixed case string', () => {
    expect(decodeForcedBoolean('TrUe')).to.be.true;
    expect(decodeForcedBoolean('FalSe')).to.be.false;
  });

  it('can force decode null as false', () => {
    expect(decodeForcedBoolean(null)).to.be.false;
  });

  it('can force decode undefined as false', () => {
    expect(decodeForcedBoolean(undefined)).to.be.false;
  });

  it('can force decode "1" as true', () => {
    expect(decodeForcedBoolean('1')).to.be.true;
  });

  it('can force decode 1 as true', () => {
    expect(decodeForcedBoolean(1)).to.be.true;
  });

  it('can force decode "0" as false', () => {
    expect(decodeForcedBoolean('0')).to.be.false;
  });

  it('can force decode 0 as false', () => {
    expect(decodeForcedBoolean(0)).to.be.false;
  });

  it('can force decode 111 as true', () => {
    expect(decodeForcedBoolean(111)).to.be.true;
  });

  it('can force decode "" as false', () => {
    expect(decodeForcedBoolean('')).to.be.false;
  });

  it('can force decode "xxx" as true', () => {
    expect(decodeForcedBoolean('xxx')).to.be.true;
  });

  it('can force decode {} as true', () => {
    expect(decodeForcedBoolean({})).to.be.true;
  });
});

describe('decodeDate', () => {
  it('can decode a date', () => {
    const now = new Date();
    expect(decodeDate(now)).to.equalDate(now);
  });

  it('throws when decoding a non-date', () => {
    expect(() => { decodeDate(43) }).to.throw();
  });

  it('throws when decoding null', () => {
    expect(() => { decodeDate(null) }).to.throw();
  });

  it('throws when decoding undefined', () => {
    expect(() => { decodeDate(undefined) }).to.throw();
  });
});

describe('decodeForcedDate', () => {
  it('can decode a date', () => {
    const now = new Date();
    expect(decodeForcedDate(now)).to.equalDate(now);
  });

  it('can force decode an ISO date', () => {
    const now = new Date();
    expect(decodeForcedDate(now.toISOString())).to.equalDate(now);
  });

  it('can force decode a string date', () => {
    const now = new Date();
    expect(decodeForcedDate(String(now))).to.equalDate(now);
  });

  it('can force decode basic a string date', () => {
    const strDate = '2020/01/01';
    expect(decodeForcedDate(strDate)).to.equalDate(new Date(strDate));
  });

  it('can force decode a numeric Unix timestamp', () => {
    const now = new Date();
    expect(decodeForcedDate(now.getTime())).to.equalDate(now);
  });

  it('can force decode a string Unix timestamp', () => {
    const now = new Date();
    expect(decodeForcedDate(String(now.getTime()))).to.equalDate(now);
  });
});
