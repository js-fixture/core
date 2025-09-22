import { produce } from "immer";
import mergeWith from "lodash.mergewith";
import { isPlaceholderValue } from "./placeholder-value";

/**
 * Deep merges two objects, forcing the values of the other object to override those of the source object.
 * Values explicitly marked as undefined in the other object will take precedence over values from the source object.
 *
 * @param {Object} src The source object.
 * @param {Object} other The other object.
 * @
 */
export function forceMerge<T, S>(src: T, other: S) {
  return produce(src, (draft) => {
    mergeWith(draft, other, customizer);
  });
}

function customizer(objValue: any, srcValue: any, key: string, obj: any) {
  // If the new value is a placeholder value, we must entirely override the original value with it to avoid
  // possibly ending up with an object that's both a placeholder and a contextual.
  if (isPlaceholderValue(srcValue)) {
    return srcValue;
  }

  if (objValue !== srcValue && typeof srcValue === "undefined") {
    obj[key] = srcValue;
  }
}
