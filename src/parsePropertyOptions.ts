export interface ParsePropertyOptions {
  optional?: boolean;
  nullable?: boolean;
  force?: boolean;
}

export type ParseArrayOptions = ParsePropertyOptions & {
  requireAll?: boolean;
  errorCollector?: (error: any) => void,
}
