import { describe, it } from 'mocha';
import * as chai from 'chai';
import { fromJson } from '../decodeJson';
import { Decoder } from '../decoder';

const expect = chai.expect;

describe('decodeJson', () => {
  it('can decode a JSON doc', () => {
    type MockType = { test: number };
    const obj: MockType = { test: 122 };
    const json = JSON.stringify(obj);
    const mockDecoder: Decoder<MockType> = input => input;
    expect(fromJson(mockDecoder)(json).test).to.equal(122);
  });

  it('returns true if value supplied is null and options allow null', () => {
    type MockType = { test: number };
    const mockDecoder: Decoder<MockType> = input => input;
    expect(fromJson(mockDecoder, { nullable: true })(null)).to.be.null;
  });

  it('returns true if value supplied is undefined and options allow undefined', () => {
    type MockType = { test: number };
    const mockDecoder: Decoder<MockType> = input => input;
    expect(fromJson(mockDecoder, { optional: true })(undefined)).to.be.undefined;
  });

  it('throws when parsing a non parseable json', () => {
    type MockType = { test: number };
    const mockDecoder: Decoder<MockType> = input => input;
    expect(() => { fromJson(mockDecoder)('xxx') }).to.throw();
  });
});