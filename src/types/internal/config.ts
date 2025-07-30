/**
 * Configuration options for the JS Fixture library.
 */
export interface Config {
  /**
   * Configuration for array generation behavior.
   * 
   * These settings control the default behavior when creating arrays
   * of fixtures using methods like `createMany()` without specifying
   * an explicit length.
   */
  array: {
    /**
     * The minimum number of items to generate in arrays.
     * 
     * When `createMany()` is called without a length parameter,
     * the library will generate at least this many items.
     * 
     * @default 1
     */
    min: number;

    /**
     * The maximum number of items to generate in arrays.
     * 
     * When `createMany()` is called without a length parameter,
     * the library will generate at most this many items.
     * 
     * @default 5
     */
    max: number;
  };
}
