export class DecodeError extends Error {
  static TAG = 'DecodeError__';

  innerError?: DecodeError;
  tag = DecodeError.TAG;

  constructor(message: string, innerError?: DecodeError) {
    super(
      innerError != null
        ? `${message}. Inner error: ${innerError.message}`
        : message,
    );
    this.innerError = innerError;
  }

  static isDecodeError(other: any) {
    return typeof other === 'object' && 'tag' in other && other.tag === DecodeError.TAG;
  }
}
