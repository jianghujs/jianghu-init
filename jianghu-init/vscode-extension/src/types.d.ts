declare module 'semver' {
  export function gt(v1: string, v2: string): boolean;
  export function lt(v1: string, v2: string): boolean;
  export function eq(v1: string, v2: string): boolean;
  export function gte(v1: string, v2: string): boolean;
  export function lte(v1: string, v2: string): boolean;
  export function satisfies(version: string, range: string): boolean;
  export function valid(v: string): string | null;
  export function clean(version: string): string | null;
} 