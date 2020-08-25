import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import { testDecodeOptions } from '../testDecodeOptions';

chai.use(chaidt);
const expect = chai.expect;

describe('testDecodeOptions', () => {
  it('returns true if value supplied is null and options allow null', () => {
    const result = testDecodeOptions(null, { nullable: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is null and options allow null (with force=true)', () => {
    const result = testDecodeOptions(null, { nullable: true, force: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is undefined and options allow optional', () => {
    const result = testDecodeOptions(undefined, { optional: true });
    expect(result).to.be.true;
  });

  it('returns true if value supplied is undefined and options allow optional (with force=true)', () => {
    const result = testDecodeOptions(undefined, { optional: true, force: true });
    expect(result).to.be.true;
  });

  it('returns false if value supplied is null and options do not allow null but force is true', () => {
    const result = testDecodeOptions(null, { force: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is null and options do not allow null but force is true (and optional is true)', () => {
    const result = testDecodeOptions(null, { force: true, optional: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is undefined and options do not allow optional but force is true', () => {
    const result = testDecodeOptions(undefined, { force: true });
    expect(result).to.be.false;
  });

  it('returns false if value supplied is undefined and options do not allow optional but force is true (and nullable is true)', () => {
    const result = testDecodeOptions(undefined, { force: true, nullable: true });
    expect(result).to.be.false;
  });

  it('throws an error if value supplied is null', () => {
    const fn = () => {
      testDecodeOptions(null);
    }
    expect(fn).to.throw();
  });

  it('throws an error if value supplied is undefined', () => {
    const fn = () => {
      testDecodeOptions(undefined);
    }
    expect(fn).to.throw();
  });
});