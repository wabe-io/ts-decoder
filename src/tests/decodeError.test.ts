import { describe, it } from 'mocha';
import * as chai from 'chai';
import { DecodeError } from '../decodeError';

const expect = chai.expect;

describe('DecodeError', () => {
  it('can recognize another DecodeError', () => {
    const e = new DecodeError('');
    expect(DecodeError.isDecodeError(e)).to.be.true;
  });

  it('can recognize another error', () => {
    const e = new Error();
    expect(DecodeError.isDecodeError(e)).to.be.false;
  });
});
