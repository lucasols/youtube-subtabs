export function deepEqual<T, I>(v1: T, v2: I, callback: (v1: T, v2: I) => void) {
  if (JSON.stringify(v1) !== JSON.stringify(v2)) {
    callback(v1, v2);
  }
}
