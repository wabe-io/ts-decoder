import { DecodeOptions } from './decodeOptions';

export type DecodeArrayOptions = DecodeOptions & {
  requireAll?: boolean;
  errorCollector?: (error: any) => void,
}
