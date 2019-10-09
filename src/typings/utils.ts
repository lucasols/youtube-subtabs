export type obj<T = any> = {
  [key: string]: T;
}

export type genericFunction = {
  (...params: any): any;
}

export type ObjectWithKey<K extends string, V = any> = { [P in K]: V };

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StrictPropertyCheck<T, TExpected, TError = "Shape of interfaces do not match"> = Exclude<keyof T, keyof TExpected> extends never ? {} : TError;

export type PartialKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
