import { describe, it } from 'mocha';
import * as chai from 'chai';
import {
  decodeLiteral,
  matchingLiteral,
  decodeLiteralUnion,
  matchingLiteralUnion,
} from '../decodeLiteral';
import { Decoder } from '../decoder';

const expect = chai.expect;

describe('decodeLiteral', () => {
  it('Can decode a literal', () => {
    const decoder = decodeLiteral('coco' as const);
    expect(decoder('coco')).to.equal('coco');
  });

  it('Can fail', () => {
    const decoder = decodeLiteral('coco' as const);
    expect(() => {
      decoder('coco2');
    }).to.throw();
  });
});

describe('matchingLiteral', () => {
  type Coco = 'coco';
  const fakeDecoder: Decoder<Coco> = () => 'coco';

  it('Can decode a literal', () => {
    const decoder = matchingLiteral('coco', fakeDecoder);
    expect(decoder('coco')).to.equal('coco');
  });

  it('Can fail', () => {
    const fakeDecoder: Decoder<Coco> = () => 'coco';
    const decoder = matchingLiteral('coco' as const, fakeDecoder);
    expect(() => {
      decoder('coco2');
    }).to.throw();
  });
});

describe('decodeLiteralUnion', () => {
  type MockUnion = 'a' | 'b' | 'c';
  const decoder = decodeLiteralUnion<MockUnion>(['a', 'b', 'c']);

  it('Can decode a literal union', () => {
    expect(decoder('a')).to.equal('a');
  });

  it('Can fail', () => {
    expect(() => {
      decoder('coco2');
    }).to.throw();
  });
});

describe('matchingLiteralUnion', () => {
  type MockUnion = 'a' | 'b' | 'c';

  it('Can decode a literal', () => {
    const mockDecoder: Decoder<string> = () => 'a';
    const decoder = matchingLiteralUnion<MockUnion>(
      ['a', 'b', 'c'],
      mockDecoder,
    );
    expect(decoder('coco')).to.equal('a');
  });

  it('Can fail', () => {
    const mockDecoder: Decoder<string> = () => 'x';
    const decoder = matchingLiteralUnion<MockUnion>(
      ['a', 'b', 'c'],
      mockDecoder,
    );
    expect(() => {
      decoder('coco');
    }).to.throw();
  });
});
