export type Vec2 = { x: number; y: number };
export type Mat2 = { a: number; b: number; c: number; d: number };

export const I: Mat2 = { a: 1, b: 0, c: 0, d: 1 };
export const v = (x: number, y: number): Vec2 => ({ x, y });
export const add = (u: Vec2, w: Vec2): Vec2 => v(u.x + w.x, u.y + w.y);
export const scale = (s: number, u: Vec2): Vec2 => v(s * u.x, s * u.y);
export const dot = (u: Vec2, w: Vec2): number => u.x * w.x + u.y * w.y;
export const norm = (u: Vec2): number => Math.hypot(u.x, u.y);
export const apply = (A: Mat2, u: Vec2): Vec2 => v(A.a * u.x + A.b * u.y, A.c * u.x + A.d * u.y);
export const det = (A: Mat2): number => A.a * A.d - A.b * A.c;
export const lerpMatrix = (A: Mat2, B: Mat2, t: number): Mat2 => ({
  a: A.a + (B.a - A.a) * t, b: A.b + (B.b - A.b) * t,
  c: A.c + (B.c - A.c) * t, d: A.d + (B.d - A.d) * t,
});
export const multiply = (A: Mat2, B: Mat2): Mat2 => ({
  a: A.a * B.a + A.b * B.c, b: A.a * B.b + A.b * B.d,
  c: A.c * B.a + A.d * B.c, d: A.c * B.b + A.d * B.d,
});
export const inverse = (A: Mat2): Mat2 | null => {
  const delta = det(A);
  if (Math.abs(delta) < 1e-10) return null;
  return { a: A.d / delta, b: -A.b / delta, c: -A.c / delta, d: A.a / delta };
};
export const rank = (A: Mat2, tolerance = 1e-9): 0 | 1 | 2 => {
  const magnitude = Math.max(Math.abs(A.a), Math.abs(A.b), Math.abs(A.c), Math.abs(A.d));
  if (magnitude < tolerance) return 0;
  return Math.abs(det(A)) > tolerance * magnitude * magnitude ? 2 : 1;
};
export const kernelDirection = (A: Mat2): Vec2 | null => {
  if (rank(A) !== 1) return null;
  const row = Math.hypot(A.a, A.b) >= Math.hypot(A.c, A.d) ? v(A.a, A.b) : v(A.c, A.d);
  const length = norm(row);
  return v(-row.y / length, row.x / length);
};
export const projectOnto = (u: Vec2, direction: Vec2): Vec2 => {
  const denominator = dot(direction, direction);
  if (denominator < 1e-12) throw new Error('Cannot project onto the zero vector');
  return scale(dot(u, direction) / denominator, direction);
};
export const changeCoordinates = (vector: Vec2, basis: Mat2): Vec2 => {
  const inv = inverse(basis);
  if (!inv) throw new Error('A basis must be invertible');
  return apply(inv, vector);
};
export const inBasis = (A: Mat2, basis: Mat2): Mat2 => {
  const inv = inverse(basis);
  if (!inv) throw new Error('A basis must be invertible');
  return multiply(multiply(inv, A), basis);
};
export const fixed = (number: number, places = 2): string => {
  const n = Math.abs(number) < 1e-9 ? 0 : number;
  return n.toFixed(places).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};
