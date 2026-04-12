declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect(actual: unknown): {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(expected: unknown): void;
};
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;

declare module 'bun:test' {
  export { afterEach, beforeEach, describe, expect, it };
  export const mock: {
    module(path: string, factory: () => Record<string, unknown>): void;
    fn<T extends (...args: unknown[]) => unknown>(impl?: T): T;
  };
}
