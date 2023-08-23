import { describe, it } from 'mocha';
import * as chai from 'chai';
import * as chaidt from 'chai-datetime';
import { decodeCommaSeparatedString } from '../decodeCommaSeparatedString';

chai.use(chaidt);
const expect = chai.expect;

describe('decodCommaSeparatedString', () => {
  it('decodes a comma separated string without comma', () => {
    const str = decodeCommaSeparatedString('1,2,3');
    expect(str).to.eql(['1', '2', '3']);
  });

  it('decodes a comma separated string without comma', () => {
    const str = decodeCommaSeparatedString('foo');
    expect(str).to.eql(['foo']);
  });
});
