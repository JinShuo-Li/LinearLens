import { apply, det, fixed, I, lerpMatrix, rank, type Mat2, type Vec2, v } from './math';

const ORIGIN = v(500, 320);
const UNIT = 104;
const screen = (p: Vec2) => v(ORIGIN.x + UNIT * p.x, ORIGIN.y - UNIT * p.y);
const point = (p: Vec2) => {
  const s = screen(p);
  return `${fixed(s.x, 3)},${fixed(s.y, 3)}`;
};
const line = (p: Vec2, q: Vec2, className: string) =>
  `<line x1="${screen(p).x}" y1="${screen(p).y}" x2="${screen(q).x}" y2="${screen(q).y}" class="${className}"/>`;
const polygon = (points: Vec2[], className: string) =>
  `<polygon points="${points.map(point).join(' ')}" class="${className}"/>`;
const circlePath = (A: Mat2) => {
  const points = Array.from({ length: 97 }, (_, i) => {
    const theta = (i / 96) * 2 * Math.PI;
    return point(apply(A, v(Math.cos(theta), Math.sin(theta))));
  });
  return `<polyline points="${points.join(' ')}" class="unit-circle-transformed"/>`;
};

export const presets: Record<string, Mat2> = {
  Shear: { a: 1, b: 0.8, c: 0.12, d: 1 },
  Scale: { a: 1.7, b: 0, c: 0, d: 0.65 },
  Rotation: { a: 0.707, b: -0.707, c: 0.707, d: 0.707 },
  Reflection: { a: -1, b: 0, c: 0, d: 1 },
  Projection: { a: 1, b: 0, c: 0, d: 0 },
  Singular: { a: 1, b: 0.8, c: 0.5, d: 0.4 },
  'Nearly singular': { a: 1, b: 0.8, c: 0.5, d: 0.405 },
};

export type SceneState = { target: Mat2; t: number; vector: Vec2; playing: boolean };
export type SceneHandle = {
  state: SceneState;
  render: () => void;
  setMatrix: (A: Mat2, animate?: boolean) => void;
  destroy: () => void;
};

export function mountScene(host: HTMLElement, options: {
  home?: boolean;
  initial?: Mat2;
  onChange?: (state: SceneState) => void;
} = {}): SceneHandle {
  const state: SceneState = {
    target: { ...(options.initial ?? presets.Shear) },
    t: options.home ? 0.68 : 1,
    vector: v(1.65, 1.15),
    playing: !!options.home,
  };
  host.innerHTML = `<svg class="geometry-svg" viewBox="0 0 1000 640" role="img" aria-label="Coordinate grid transformed by a two by two matrix"><defs>
    <clipPath id="scene-clip"><rect width="1000" height="640"/></clipPath>
    <marker id="arrow-red" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#e33b34"/></marker>
    <marker id="arrow-blue" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#72aecb"/></marker>
    <marker id="arrow-cream" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#f3e9d6"/></marker>
  </defs><g class="scene-content" clip-path="url(#scene-clip)"></g></svg>`;
  const svg = host.querySelector('svg')!;
  const content = svg.querySelector('.scene-content')!;
  let drag: 'vector' | 'e1' | 'e2' | null = null;
  let frame = 0;
  let lastTime = 0;
  let homePhase = 0;

  function render() {
    const A = lerpMatrix(I, state.target, state.t);
    const basis1 = apply(A, v(1, 0));
    const basis2 = apply(A, v(0, 1));
    const transformedVector = apply(A, state.vector);
    const staticGrid: string[] = [];
    const movedGrid: string[] = [];
    for (let i = -12; i <= 12; i++) {
      staticGrid.push(line(v(i, -12), v(i, 12), i === 0 ? 'axis-static' : 'grid-static'));
      staticGrid.push(line(v(-12, i), v(12, i), i === 0 ? 'axis-static' : 'grid-static'));
      movedGrid.push(line(apply(A, v(i, -12)), apply(A, v(i, 12)), i === 0 ? 'axis-moved' : 'grid-moved'));
      movedGrid.push(line(apply(A, v(-12, i)), apply(A, v(12, i)), i === 0 ? 'axis-moved' : 'grid-moved'));
    }
    const square = [v(0, 0), v(1, 0), v(1, 1), v(0, 1)];
    const transformedSquare = square.map(p => apply(A, p));
    const guide = line(state.vector, transformedVector, 'vector-guide');
    content.innerHTML = `
      <g>${staticGrid.join('')}</g>
      <g>${movedGrid.join('')}</g>
      <circle cx="500" cy="320" r="${UNIT}" class="unit-circle-original"/>
      ${polygon(square, 'unit-square-original')}
      ${polygon(transformedSquare, det(A) < -1e-8 ? 'unit-square-transformed reversed' : 'unit-square-transformed')}
      ${circlePath(A)}
      ${guide}
      ${line(v(0, 0), v(1, 0), 'vector-original')}
      ${line(v(0, 0), v(0, 1), 'vector-original')}
      ${line(v(0, 0), basis1, 'vector-basis-one')}
      ${line(v(0, 0), basis2, 'vector-basis-two')}
      ${line(v(0, 0), state.vector, 'vector-input')}
      ${line(v(0, 0), transformedVector, 'vector-output')}
      <circle cx="${screen(basis1).x}" cy="${screen(basis1).y}" r="15" class="drag-hit" data-drag="e1"/>
      <circle cx="${screen(basis2).x}" cy="${screen(basis2).y}" r="15" class="drag-hit" data-drag="e2"/>
      <circle cx="${screen(state.vector).x}" cy="${screen(state.vector).y}" r="17" class="drag-hit" data-drag="vector"/>
      <circle cx="${screen(basis1).x}" cy="${screen(basis1).y}" r="5" class="dot-red"/>
      <circle cx="${screen(basis2).x}" cy="${screen(basis2).y}" r="5" class="dot-blue"/>
      <circle cx="${screen(state.vector).x}" cy="${screen(state.vector).y}" r="6" class="dot-cream"/>
      <text x="${screen(basis1).x + 15}" y="${screen(basis1).y - 12}" class="scene-label red">Ae₁</text>
      <text x="${screen(basis2).x + 15}" y="${screen(basis2).y - 12}" class="scene-label blue">Ae₂</text>
      <text x="${screen(state.vector).x + 15}" y="${screen(state.vector).y + 24}" class="scene-label">v</text>
      <text x="${screen(transformedVector).x + 14}" y="${screen(transformedVector).y - 11}" class="scene-label red">Av</text>
      <text x="28" y="41" class="scene-meta">INPUT SPACE  /  OUTPUT SPACE</text>
      <text x="28" y="608" class="scene-meta">DRAG THE VECTOR OR THE IMAGE BASIS • RANK ${rank(A)} • SIGNED AREA ${fixed(det(A))}</text>
    `;
    options.onChange?.(state);
  }
  function worldFromEvent(event: PointerEvent): Vec2 {
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const q = p.matrixTransform(svg.getScreenCTM()!.inverse());
    return v((q.x - ORIGIN.x) / UNIT, (ORIGIN.y - q.y) / UNIT);
  }
  svg.addEventListener('pointerdown', event => {
    if (options.home) return;
    const target = event.target as SVGElement;
    const kind = target.dataset.drag;
    if (kind !== 'vector' && kind !== 'e1' && kind !== 'e2') return;
    drag = kind;
    state.playing = false;
    state.t = 1;
    svg.setPointerCapture(event.pointerId);
    render();
  });
  svg.addEventListener('pointermove', event => {
    if (!drag) return;
    const p = worldFromEvent(event);
    const limited = v(Math.max(-4, Math.min(4, p.x)), Math.max(-3, Math.min(3, p.y)));
    if (drag === 'vector') state.vector = limited;
    if (drag === 'e1') {
      state.target.a = limited.x;
      state.target.c = limited.y;
    }
    if (drag === 'e2') {
      state.target.b = limited.x;
      state.target.d = limited.y;
    }
    render();
  });
  svg.addEventListener('pointerup', () => { drag = null; });
  svg.addEventListener('pointercancel', () => { drag = null; });

  function tick(time: number) {
    const dt = Math.min(50, time - (lastTime || time));
    lastTime = time;
    if (options.home) {
      homePhase += dt / 1000;
      state.t = 0.57 + 0.32 * Math.sin(homePhase * 0.42);
      render();
    } else if (state.playing) {
      state.t = Math.min(1, state.t + dt / 1800);
      if (state.t >= 1) state.playing = false;
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  render();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) frame = requestAnimationFrame(tick);
  return {
    state,
    render,
    setMatrix(A, animate = true) {
      state.target = { ...A };
      state.t = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
      state.playing = state.t === 0;
      render();
    },
    destroy() { cancelAnimationFrame(frame); },
  };
}
