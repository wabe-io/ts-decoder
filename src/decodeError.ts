export class DecodeError {
  static TAG = 'DecodeError__';

  message: string;
  innerError?: DecodeError;
  tag = DecodeError.TAG;

  constructor(message: string, innerError?: DecodeError) {
    this.message = innerError != null
      ? `${message}. Inner error: ${innerError.message}`
      : message;
    this.innerError = innerError;
  }

  static isDecodeError(other: any) {
    return typeof other === 'object' && 'tag' in other && other.tag === DecodeError.TAG;
  }
}
