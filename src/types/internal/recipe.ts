import { LazyValue } from "./lazy";

export type Recipe<T> = { [K in keyof T]: T[K] | LazyValue<T[K]>}