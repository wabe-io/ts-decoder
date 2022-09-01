import { describe, it } from 'mocha';
import * as chai from 'chai';
import { decodeUnion } from '../decodeUnion';
import { Decoder } from '../decoder';

const expect = chai.expect;

describe('decodeUnion', () => {
  it('Can discriminate a string from an number', () => {
    type A = string;
    type B = number;
    type AorB = A | B;

    const decodeA: Decoder<A> = (input: any) => input as any as A;
    const decodeB: Decoder<B> = (_: any) => {
      throw new Error('Not expected to call this decoder');
    };

    const i: AorB = 'str';

    const aOrBDecoder = decodeUnion<A, B>((input) => {
      if (typeof input === 'string') {
        return decodeA;
      } else if (typeof input === 'number') {
        return decodeB;
      }

      throw new Error('Not expected to get here');
    });

    expect(i).to.equal(aOrBDecoder(i));
  });

  it('Can discriminate a string from an number on a 3 param overload', () => {
    type A = string;
    type B = number;
    type C = boolean;
    type AorBorC = A | B | C;

    const decodeA: Decoder<A> = (_: any) => {
      throw new Error('Not expected to call this decoder');
    };
    const decodeB: Decoder<B> = (_: any) => {
      throw new Error('Not expected to call this decoder');
    };
    const decodeC: Decoder<C> = (input: any) => input as any as C;

    const i: AorBorC = 'str';

    const aOrBOrCDecoder = decodeUnion<A, B, C>((input) => {
      if (typeof input === 'boolean') {
        return decodeA;
      } else if (typeof input === 'number') {
        return decodeB;
      } else if (typeof input === 'string') {
        return decodeC;
      }

      throw new Error('Not expected to get here');
    });

    expect(i).to.equal(aOrBOrCDecoder(i));
  });

  it('Can thows on non-exhaustive decoding', () => {
    type A = string;
    const dummyDecoder: Decoder<A> = (input: any) => input as any as A;

    const aOrBDecoder = decodeUnion<A, A>((input) => {
      if (input === false) {
        return dummyDecoder;
      }
    });

    expect(() => {
      aOrBDecoder(1);
    }).to.throw();
  });
});
