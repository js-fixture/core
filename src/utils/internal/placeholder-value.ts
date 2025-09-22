import { ContextImpl } from "core/internal";
import { PlaceholderValue } from "types/internal";

export function placeholderValue<TFixture, TValue>(
  fn: (ctx: ContextImpl<TFixture>) => TValue,
  uuid: string,
): PlaceholderValue<TValue> {
  return {
    recipeUUID: uuid,
    placeholder: true,
    get: (ctx) => {
      return fn(ctx);
    },
  };
}

export function isPlaceholderValue<TValue>(value: any): value is PlaceholderValue<TValue> {
  return value && value["placeholder"] === true;
}

export function isPlaceholderValueForContext<TValue>(recipeUUID: string, value: any): value is PlaceholderValue<TValue> {
  return isPlaceholderValue(value) && value.recipeUUID === recipeUUID;
}
