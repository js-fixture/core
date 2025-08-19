export type Override<T> = {
  [K in keyof T]?: T[K] extends object
    ? Override<T[K]>
    : T[K];
};