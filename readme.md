-------------------------------------------------------------------------------------------------
ts-decoder
An functional, opinionated TypeScript library to decode an arbitrary input into type-safe objects
-------------------------------------------------------------------------------------------------

Some features of ts-decoder:

* Functional-style: no classes, all operations are data-last for easier composition. Many functions already return function objects (partial application).
* Built in decoders for basic types: boolean, number, string and date
* Support for typed array and iterable decoding
* Support for object decoding
* Provides a base DecoderError class to distinguish decoding errors from anything else
* Provides a very simple Decoder TS interface (`type Decoder<T> = (input: any) => T`) so bulding a custom decoder is very easy.
* Supports decoding nested array, iterable and object structure either fully or partially
* Provides a mechanism for collection decoding errors on nested structures without aborting the decoding process (functional-style error bubbling)
* Strict or forced decoding. Strict mode checks for types to be exactly as expected. Forced decoding attempts to map the input to the output type
