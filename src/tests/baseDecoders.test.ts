import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import {
  decodeNumber,
  decodeString,
  decodeBoolean,
  decodeDate,
} from '../baseDecoders';

chai.use(chaidt);
const expect = chai.expect;

describe('decodeNumber', () => {
  it('can decode a number', () => {
    expect(decodeNumber()(5)).to.equal(5);
  });

  it('can decode a float', () => {
    const x = 0.4;
    expect(decodeNumber()(x)).to.equal(x);
  });

  it('can force decode a number', () => {
    expect(decodeNumber({ force: true })('5')).to.equal(5);
  });

  it('can force decode a float', () => {
    expect(decodeNumber({ force: true })('5.5')).to.equal(5.5);
  });

  it('can decode an optional value', () => {
    expect(decodeNumber({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(decodeNumber({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(decodeNumber({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(decodeNumber({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an string', () => {
    expect(() => { decodeNumber()('0')}).to.throw();
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeNumber()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeNumber()(null)}).to.throw();
  });

  it('throws when force decoding a non-numeric value', () => {
    expect(() => { decodeNumber({ force: true })('')}).to.throw();
  });

  it('throws when force decoding a null value', () => {
    expect(() => { decodeNumber({ force: true })(null)}).to.throw();
  });

  it('throws when force decoding an undefined value', () => {
    expect(() => { decodeNumber({ force: true })(undefined)}).to.throw();
  });
});

describe('decodeString', () => {
  it('can decode a string', () => {
    const str = 'The string';
    expect(decodeString()(str)).to.equal('The string');
  });

  it('can force decode a number', () => {
    expect(decodeString({ force: true })(5)).to.equal('5');
  });

  it('can force decode a boolean', () => {
    expect(decodeString({ force: true })(true)).to.equal('true');
  });

  it('can force decode a null value', () => {
    expect(decodeString({ force: true })(null)).to.equal('null');
  });

  it('can force decode an undefined value', () => {
    expect(decodeString({ force: true })(undefined)).to.equal('undefined');
  });

  it('can force decode a date using ISO format', () => {
    const now = new Date();
    expect(decodeString({ force: true })(now)).to.equal(now.toISOString());
  });

  it('can decode an optional value', () => {
    expect(decodeString({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(decodeString({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(decodeString({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(decodeString({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeString()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeString()(null)}).to.throw();
  });
});

describe('decodeBoolean', () => {
  it('can decode a truth', () => {
    expect(decodeBoolean()(true)).to.be.true;
  });

  it('can force decode a false', () => {
    expect(decodeBoolean()(false)).to.be.false;
  });

  it('can decode an optional value', () => {
    expect(decodeBoolean({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(decodeBoolean({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(decodeBoolean({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(decodeBoolean({ nullable: true, force: true })(null)).to.be.null;
  });

  it('throws when decoding an optional value', () => {
    expect(() => { decodeBoolean()(undefined)}).to.throw();
  });

  it('throws when decoding an null value', () => {
    expect(() => { decodeBoolean()(null)}).to.throw();
  });

  it('can force decode a lowercase string', () => {
    expect(decodeBoolean({ force: true })('true')).to.be.true;
    expect(decodeBoolean({ force: true })('false')).to.be.false;
  });

  it('can force decode a mixed case string', () => {
    expect(decodeBoolean({ force: true })('TrUe')).to.be.true;
    expect(decodeBoolean({ force: true })('FalSe')).to.be.false;
  });

  it('can force decode null as false', () => {
    expect(decodeBoolean({ force: true })(null)).to.be.false;
  });

  it('can force decode undefined as false', () => {
    expect(decodeBoolean({ force: true })(undefined)).to.be.false;
  });

  it('can force decode "1" as true', () => {
    expect(decodeBoolean({ force: true })('1')).to.be.true;
  });

  it('can force decode 1 as true', () => {
    expect(decodeBoolean({ force: true })(1)).to.be.true;
  });

  it('can force decode "0" as false', () => {
    expect(decodeBoolean({ force: true })('0')).to.be.false;
  });

  it('can force decode 0 as false', () => {
    expect(decodeBoolean({ force: true })(0)).to.be.false;
  });

  it('can force decode 111 as true', () => {
    expect(decodeBoolean({ force: true })(111)).to.be.true;
  });

  it('can force decode "" as false', () => {
    expect(decodeBoolean({ force: true })('')).to.be.false;
  });

  it('can force decode "xxx" as true', () => {
    expect(decodeBoolean({ force: true })('xxx')).to.be.true;
  });

  it('can force decode {} as true', () => {
    expect(decodeBoolean({ force: true })({})).to.be.true;
  });
});

describe('decodeDate', () => {
  it('can decode a date', () => {
    const now = new Date();
    expect(decodeDate()(now)).to.equalDate(now);
  });

  it('can force decode an ISO date', () => {
    const now = new Date();
    expect(decodeDate({ force: true })(now.toISOString())).to.equalDate(now);
  });

  it('can force decode a string date', () => {
    const now = new Date();
    expect(decodeDate({ force: true })(String(now))).to.equalDate(now);
  });

  it('can force decode basic a string date', () => {
    const strDate = '2020/01/01';
    expect(decodeDate({ force: true })(strDate)).to.equalDate(new Date(strDate));
  });

  it('can force decode a numeric Unix timestamp', () => {
    const now = new Date();
    expect(decodeDate({ force: true })(now.getTime())).to.equalDate(now);
  });

  it('can force decode a string Unix timestamp', () => {
    const now = new Date();
    expect(decodeDate({ force: true })(String(now.getTime()))).to.equalDate(now);
  });

  it('can decode an optional value', () => {
    expect(decodeDate({ optional: true })(undefined)).to.be.undefined;
  });

  it('can decode an optional value (with force=true)', () => {
    expect(decodeDate({ optional: true, force: true })(undefined)).to.be.undefined;
  });

  it('can decode a null value', () => {
    expect(decodeDate({ nullable: true })(null)).to.be.null;
  });

  it('can decode a null value (with force=true)', () => {
    expect(decodeDate({ nullable: true, force: true })(null)).to.be.null;
  });
});
