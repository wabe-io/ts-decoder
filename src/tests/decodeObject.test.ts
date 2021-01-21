import { describe, it } from 'mocha';
import * as chai from 'chai';
import { decodeObject } from '../decodeObject';
import { DecodeError } from '../decodeError';

const expect = chai.expect;

describe('decodeObject', () => {
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
      const decoder = decodeObject(name, () => null);
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
      const dummyDecoder = () => { throw new DecodeError('test'); };

      const decoder = decodeObject(entityName, prop => ({
        zz: prop(propName, dummyDecoder),
      }));

      decoder({ prop1: null });
      expect.fail('Expected exception to be thrown');
    } catch (e) {
      expect(e.message).to.contain(`${entityName}.${propName}`);
    }
  });

  it('throws an error including entity and field name for a deep error', () => {
    const entity1Name = 'XX21DSADSA';
    const entity2Name = '777trER';
    const prop1Name = 'prop1';
    const prop2Name = 'prop2';

    try {
      const failDecoder = (z: any) => { throw new DecodeError('test'); };

      const decoder2 = decodeObject(entity2Name, prop => ({
        zz: prop(prop2Name, failDecoder),
      }));

      const decoder1 = decodeObject(entity1Name, prop => ({
        prop1: prop(prop1Name, decoder2),
      }));

      decoder1({ prop1: { prop2: null } });
      expect.fail('Expected exception to be thrown');
    } catch (e) {
      expect(e.message).to.contain(`${entity1Name}.${prop1Name}`);
      expect(e.message).to.contain(`${entity2Name}.${prop2Name}`);
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
