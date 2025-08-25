export class AutoCounter {
  private sequences = new Map<string, number>();

  getNextValue(key?: string): number {
    key = key || "";
    const value = (this.sequences.get(key) || 0) + 1;
    this.sequences.set(key, value);
    return value;
  }
}
