import { ContextImpl } from "core/internal";

export type PlaceholderValue<TValue> = {
  recipeUUID:string,
  placeholder: true;
  get: (ctx: ContextImpl<any>) => TValue;
};
