import { describe, it } from 'mocha';
import * as chai from 'chai';
import { decodeObject } from '../decodeObject';

const expect = chai.expect;

describe('decodeObject', () => {
  it('can decode a null input', () => {
    expect(decodeObject('', () => {}, { nullable: true })(null)).to.be.null;
  });

  it('can decode an undefined input', () => {
    expect(decodeObject('', () => {}, { optional: true })(undefined)).to.be.undefined;
  });

  it('throws on a null input', () => {
    expect(() => { decodeObject('', () => {})(null) }).to.throw();
  });

  it('throws on a undefined input', () => {
    expect(() => { decodeObject('', () => {})(undefined) }).to.throw();
  });

  it('calls the callback', () => {
    let calls = 0;
    decodeObject<{}>('', () => {
      calls ++;
      return {};
    })({});

    expect(calls).to.equal(1);
  });

  it('returns what is given', () => {
    const obj = {};
    const decoded = decodeObject<{}>('', () => {
      return obj;
    })({});

    expect(obj).to.equal(decoded);
  });
});