import { describe, expect, it } from 'vitest';
import { apply, changeCoordinates, det, I, inBasis, kernelDirection, multiply, projectOnto, rank, v } from './math';

describe('small exact geometric examples', () => {
  it('computes oriented area and rank through a collapse', () => {
    expect(det({ a: 2, b: 1, c: 0, d: 3 })).toBe(6);
    expect(det({ a: 2, b: 4, c: 1, d: 2 })).toBe(0);
    expect(rank({ a: 2, b: 4, c: 1, d: 2 })).toBe(1);
    expect(rank({ a: 0, b: 0, c: 0, d: 0 })).toBe(0);
    const k = kernelDirection({ a: 2, b: 4, c: 1, d: 2 })!;
    expect(Math.hypot(...Object.values(apply({ a: 2, b: 4, c: 1, d: 2 }, k)))).toBeLessThan(1e-10);
  });
  it('projects with an orthogonal residual', () => {
    const direction = v(2, 1);
    const p = projectOnto(v(3, 4), direction);
    expect(p).toEqual(v(4, 2));
    expect((3 - p.x) * direction.x + (4 - p.y) * direction.y).toBe(0);
  });
  it('changes coordinates while preserving the physical vector and map', () => {
    const basis = { a: 1, b: 1, c: 0, d: 1 };
    const A = { a: 2, b: 0, c: 0, d: 3 };
    const x = v(4, 2);
    const coordinate = changeCoordinates(x, basis);
    expect(apply(basis, coordinate)).toEqual(x);
    expect(apply(basis, apply(inBasis(A, basis), coordinate))).toEqual(apply(A, x));
    expect(multiply(I, A)).toEqual(A);
  });
});
