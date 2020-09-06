import { DecodeError } from './decodeError';
import { Decoder } from './decoder';

interface DecoderUnionType {
  <A, B>(discriminator: (input: any) => Decoder<A> | Decoder<B> | undefined): Decoder<A | B>;
  <A, B, C>(discriminator: (input: any) => Decoder<A> | Decoder<B> | Decoder<C> | undefined): Decoder<A | B | C>;
  <A, B, C, D>(discriminator: (input: any) => Decoder<A> | Decoder<B> | Decoder<C> | Decoder<D> | undefined): Decoder<A | B | C | D>;
  <A, B, C, D, E>(discriminator: (input: any) => Decoder<A> | Decoder<B> | Decoder<C> | Decoder<D> | Decoder<E> | undefined): Decoder<A | B | C | D | E>;
}

export const decodeUnion: DecoderUnionType = <A>(discriminator: (input: any) => Decoder<A> | undefined): Decoder<A> => input => {
  const decoder = discriminator(input);
  if (decoder === undefined) {
    throw new DecodeError('decodeUnion was provided a non-exhaustive type chech');
  }
  return decoder(input);
};