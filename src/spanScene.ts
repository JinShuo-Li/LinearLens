import { add, det, fixed, norm, projectOnto, rank, scale, type Vec2, v } from './math';

const origin = v(500, 320);
const unit = 104;
const screen = (p: Vec2) => v(origin.x + unit * p.x, origin.y - unit * p.y);
const coords = (p: Vec2) => `${screen(p).x},${screen(p).y}`;

export type SpanHandle = {
  vectors: [Vec2, Vec2];
  render: () => void;
  setPreset: (name: string) => void;
  destroy: () => void;
};

export function mountSpanScene(host: HTMLElement, onChange: (vectors: [Vec2, Vec2]) => void): SpanHandle {
  const vectors: [Vec2, Vec2] = [v(1.65, 0.45), v(0.55, 1.4)];
  host.innerHTML = `<svg class="geometry-svg" viewBox="0 0 1000 640" role="img" aria-label="Span of two draggable vectors"><defs>
    <marker id="arrow-red" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#e33b34"/></marker>
    <marker id="arrow-blue" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#72aecb"/></marker>
  </defs><g class="scene-content"></g></svg>`;
  const svg = host.querySelector('svg')!;
  const content = svg.querySelector('.scene-content')!;
  const adjustView = () => svg.setAttribute('viewBox', window.innerWidth <= 700 ? '220 70 560 500' : '0 0 1000 640');
  adjustView();
  window.addEventListener('resize', adjustView);
  let drag = -1;
  function render() {
    const [u, w] = vectors;
    const area = det({ a: u.x, b: w.x, c: u.y, d: w.y });
    const dimension = rank({ a: u.x, b: w.x, c: u.y, d: w.y });
    const dependent = dimension < 2;
    const grid: string[] = [];
    for (let i = -6; i <= 6; i++) {
      grid.push(`<line x1="${screen(v(i, -4)).x}" y1="0" x2="${screen(v(i, 4)).x}" y2="640" class="grid-static"/>`);
      grid.push(`<line x1="0" y1="${screen(v(-6, i)).y}" x2="1000" y2="${screen(v(6, i)).y}" class="grid-static"/>`);
    }
    const dots: string[] = [];
    for (let s = -3; s <= 3; s++) for (let t = -3; t <= 3; t++) {
      const p = screen(add(scale(s * 0.5, u), scale(t * 0.5, w)));
      dots.push(`<circle cx="${p.x}" cy="${p.y}" r="3.5" class="span-dot"/>`);
    }
    const direction = norm(u) > 1e-9 ? u : w;
    const strip = dependent && dimension === 1
      ? `<line x1="${screen(scale(-5, direction)).x}" y1="${screen(scale(-5, direction)).y}" x2="${screen(scale(5, direction)).x}" y2="${screen(scale(5, direction)).y}" class="span-line"/>`
      : dimension === 0 ? '<circle cx="500" cy="320" r="28" class="span-origin"/>'
      : `<rect width="1000" height="640" class="span-plane"/>`;
    const p1 = screen(u), p2 = screen(w), sum = screen(add(u,w));
    content.innerHTML = `
      ${grid.join('')}
      ${strip}
      <line x1="0" y1="320" x2="1000" y2="320" class="axis-static"/>
      <line x1="500" y1="0" x2="500" y2="640" class="axis-static"/>
      <polygon points="${coords(v(0,0))} ${coords(u)} ${coords(add(u,w))} ${coords(w)}" class="span-parallelogram"/>
      ${dots.join('')}
      <line x1="500" y1="320" x2="${p1.x}" y2="${p1.y}" class="vector-basis-one"/>
      <line x1="500" y1="320" x2="${p2.x}" y2="${p2.y}" class="vector-basis-two"/>
      <line x1="500" y1="320" x2="${sum.x}" y2="${sum.y}" class="vector-sum"/>
      <circle cx="${p1.x}" cy="${p1.y}" r="18" data-drag="0" class="drag-hit"/>
      <circle cx="${p2.x}" cy="${p2.y}" r="18" data-drag="1" class="drag-hit"/>
      <circle cx="${p1.x}" cy="${p1.y}" r="6" class="dot-red"/>
      <circle cx="${p2.x}" cy="${p2.y}" r="6" class="dot-blue"/>
      <text x="${p1.x + 17}" y="${p1.y - 12}" class="scene-label red">v₁</text>
      <text x="${p2.x + 17}" y="${p2.y - 12}" class="scene-label blue">v₂</text>
      <text x="${sum.x + 14}" y="${sum.y - 12}" class="scene-label">v₁ + v₂</text>
      <text x="28" y="41" class="scene-meta">ALL LINEAR COMBINATIONS / SAMPLE LATTICE</text>
      <text x="28" y="608" class="scene-meta">DRAG EITHER GENERATOR • SPAN DIMENSION ${dimension} • ORIENTED AREA ${fixed(area)}</text>
    `;
    onChange(vectors);
  }
  function world(event: PointerEvent) {
    const p = svg.createSVGPoint();
    p.x = event.clientX; p.y = event.clientY;
    const q = p.matrixTransform(svg.getScreenCTM()!.inverse());
    return v((q.x - origin.x) / unit, (origin.y - q.y) / unit);
  }
  svg.addEventListener('pointerdown', event => {
    const index = Number((event.target as SVGElement).dataset.drag);
    if (index !== 0 && index !== 1) return;
    drag = index;
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', event => {
    if (drag < 0) return;
    const p = world(event);
    let next = v(Math.max(-3.8, Math.min(3.8, p.x)), Math.max(-2.7, Math.min(2.7, p.y)));
    if (norm(next) < 0.055) next = v(0, 0);
    const other = vectors[1 - drag];
    if (norm(next) > 0 && norm(other) > 0) {
      const area = next.x * other.y - next.y * other.x;
      if (Math.abs(area) / (norm(next) * norm(other)) < 0.025) next = projectOnto(next, other);
    }
    vectors[drag] = next;
    render();
  });
  svg.addEventListener('pointerup', () => { drag = -1; });
  svg.addEventListener('pointercancel', () => { drag = -1; });
  render();
  return {
    vectors, render,
    setPreset(name) {
      if (name === 'Independent') { vectors[0] = v(1.65, 0.45); vectors[1] = v(0.55, 1.4); }
      if (name === 'Dependent') { vectors[0] = v(1.5, 0.75); vectors[1] = v(2.25, 1.125); }
      if (name === 'One direction') { vectors[0] = v(1.7, 0.6); vectors[1] = v(0, 0); }
      render();
    },
    destroy() { window.removeEventListener('resize', adjustView); },
  };
}
