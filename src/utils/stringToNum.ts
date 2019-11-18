export function stringToNum(string: any) {
  return !Number.isNaN(+string) ? +string : undefined;
}
