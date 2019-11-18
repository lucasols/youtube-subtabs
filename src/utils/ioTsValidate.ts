import { pipe } from 'fp-ts/lib/pipeable';
import { fold, Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export function validate<T extends t.Type<any>>(
  data: any,
  type: T,
  onLeft: (value: T['_A']) => any,
  onRight?: (error: t.Errors, result: Either<t.Errors, T['_A']>) => any,
) {
  const result = type.decode(data);

  pipe(
    result,
    fold(e => onRight?.(e, result), onLeft),
  );
}
