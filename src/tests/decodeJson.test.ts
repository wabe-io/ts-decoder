import { describe, it } from 'mocha';
import * as chai from 'chai';
import { fromJson } from '../decodeJson';
import { Decoder } from '../decoder';

const expect = chai.expect;

describe('decodeJson', () => {
  type MockType = { test: number };
  const obj: MockType = { test: 122 };
  const json = JSON.stringify(obj);  
  const mockDecoder: Decoder<MockType> = input => input;

  it('can decode a JSON doc', () => {
    expect(fromJson(mockDecoder)(json).test).to.equal(122);
  });

  it('throws when parsing a non parseable json', () => {
    expect(() => { fromJson(mockDecoder)('xxx') }).to.throw();
  });

  it('throws when parsing null', () => {
    expect(() => { fromJson(mockDecoder)(null) }).to.throw();
  });

  it('throws when parsing undefined', () => {
    expect(() => { fromJson(mockDecoder)(undefined) }).to.throw();
  });
});