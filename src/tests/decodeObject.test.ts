import { describe, it } from 'mocha';
import * as chai from 'chai';
import { decodeObject } from '../decodeObject';
import { DecodeError } from '../decodeError';

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

  it('throws an error including entity name', () => {
    const name = 'XX21DSADSA';
    try {
      const decoder = decodeObject(name, xx => null);
      decoder(null);
      expect.fail('Expected exception to be thrown');
    } catch (e) {
      expect(e.message).to.contain(name);
    }
  });

  it('throws an error including entity and field name', () => {
    const entityName = 'XX21DSADSA';
    const propName = 'prop1';

    try {
      const dummyDecoder = (z: any) => { throw new DecodeError('test'); };

      const decoder = decodeObject(entityName, prop => ({
        zz: prop(propName, dummyDecoder),
      }));

      decoder({ prop1: null });
      expect.fail('Expected exception to be thrown');
    } catch (e) {
      expect(e.message).to.contain(`${entityName}.${propName}`);
    }
  });

  it('returns what is given', () => {
    const obj = {};
    const decoded = decodeObject<{}>('', () => {
      return obj;
    })({});

    expect(obj).to.equal(decoded);
  });
});