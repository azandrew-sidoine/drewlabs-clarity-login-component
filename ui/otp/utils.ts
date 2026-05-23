/** @internal checks if `l` is recursively equal to `r` */
export function deequal(l: any[], r: any[]): boolean {
  if (l.length !== r.length) {
    return false;
  }
  let equals = true;
  for (let i = 0; i < l.length; i++) {
    if (Array.isArray(l[i]) && Array.isArray(r[i])) {
      equals = deequal(l[i], r[i]);
    } else {
      equals = l[i] === r[i];
    }

    if (equals === false) {
      break;
    }
  }

  return equals;
}


// @internal right pad string implementation
export function rpad<T = unknown>(list: T[], value: T, size: number) {
  if (list.length >= size) {
    return list;
  }
  return list.concat(...new Array((length = size - list.length)).fill(value));
}
