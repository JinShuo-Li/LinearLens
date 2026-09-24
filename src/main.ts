import 'katex/dist/katex.min.css';
import './style.css';
import { theory } from './content';
import { apply, det, fixed, rank, type Mat2, v } from './math';
import { mountScene, presets, type SceneHandle } from './scene';
import { mountSpanScene, type SpanHandle } from './spanScene';

const app = document.querySelector<HTMLDivElement>('#app')!;
let cleanup: (() => void) | undefined;
const lessonIds = ['span', 'matrix', 'determinant'] as const;
type LessonId = typeof lessonIds[number];

const chapters = [
  { number: '01', title: 'SEEING SPACE', description: 'Directions, combinations, and the meaning of dimension.', topics: ['Vectors', 'Linear Combinations', 'Span', 'Linear Independence', 'Basis', 'Dimension'], ready: ['Span / Basis / Independence'], href: '#/lesson/span' },
  { number: '02', title: 'SEEING TRANSFORMATIONS', description: 'What survives when a map reshapes space?', topics: ['Matrix as Transformation', 'Linear Systems', 'Gaussian Elimination', 'Rank', 'Kernel', 'Image', 'Determinant', 'Invertibility'], ready: ['Matrix as Space Deformer', 'Determinant'], href: '#/lesson/matrix' },
  { number: '03', title: 'SEEING STRUCTURE', description: 'Find the directions that make a map simple.', topics: ['Eigenvalues', 'Eigenvectors', 'Change of Basis', 'Similarity', 'Diagonalization', 'Symmetric Matrices', 'Quadratic Forms'], ready: [], href: '' },
  { number: '04', title: 'SEEING APPROXIMATION', description: 'Project, factor, and keep the information that matters.', topics: ['Orthogonal Projection', 'Least Squares', 'Gram–Schmidt', 'QR', 'SVD', 'Pseudoinverse', 'Condition Number', 'Low-rank Approximation'], ready: [], href: '' },
  { number: '05', title: 'BEYOND THE BASICS', description: 'Explore repeated maps and the four fundamental subspaces.', topics: ['Iterated Linear Maps', 'Complex Eigenvalues', 'Nilpotent Maps', 'Jordan Chains', 'Four Fundamental Subspaces'], ready: [], href: '' },
];

function header(dark = false) {
  return `<header class="site-header ${dark ? 'on-dark' : ''}">
    <a class="brand" href="#/" aria-label="LinearLens home"><span class="brand-mark">L<span></span></span><span>LINEARLENS</span></a>
    <nav aria-label="Primary navigation"><a href="#/chapters">EXPLORE THE ATLAS</a><a href="#/lesson/matrix">OPEN THE LAB <span aria-hidden="true">↗</span></a></nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-top"><div class="brand"><span class="brand-mark">L<span></span></span><span>LINEARLENS</span></div><p>See the geometry behind linear algebra.</p></div><div class="footer-bottom"><span>AN INTERACTIVE MATHEMATICAL ATLAS</span><span>BUILT FOR CURIOUS MINDS</span><a href="#/">BACK TO TOP ↑</a></div></footer>`;
}

function chapterBlock(chapter: typeof chapters[number], index: number) {
  return `<article class="chapter-block ${index % 2 ? 'chapter-light' : 'chapter-dark'}" id="chapter-${chapter.number}">
    <div class="chapter-number">${chapter.number}<span> / 05</span></div>
    <div class="chapter-main"><p class="eyebrow">CHAPTER ${chapter.number} / LINEARLENS ATLAS</p><h3>${chapter.title}</h3><p class="chapter-description">${chapter.description}</p>
      <div class="topic-list">${chapter.topics.map(topic => `<span>${topic}</span>`).join('')}</div>
      ${chapter.ready.length ? `<a class="text-link" href="${chapter.href}">ENTER THE CHAPTER <span>↗</span></a>` : '<span class="chapter-status">IN DEVELOPMENT</span>'}
    </div>
    <div class="chapter-art chapter-art-${index + 1}" aria-hidden="true"><span>${index === 0 ? 'V = SPAN{v₁, v₂}' : index === 1 ? 'A : V → W' : index === 2 ? 'Av = λv' : index === 3 ? 'A = UΣVᵀ' : 'xₖ₊₁ = Axₖ'}</span><i></i><b></b></div>
  </article>`;
}

function renderHome() {
  app.innerHTML = `${header(true)}
  <main>
    <section class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="red-line"></span> AN INTERACTIVE MATHEMATICAL ATLAS</p>
        <h1>SEE THE<br>GEOMETRY<br><em>BEHIND</em><br>LINEAR ALGEBRA.</h1>
        <p class="hero-summary">A matrix is more than an array of numbers.<br>It is a transformation of space.</p>
        <a href="#/lesson/matrix" class="hero-cta">EXPLORE THE TRANSFORMATION <span>↗</span></a>
      </div>
      <div class="hero-visual"><div class="home-scene" id="home-scene"></div><div class="hero-visual-caption"><span>LIVE FIELD STUDY / 001</span><span>A(t) = (1 − t)I + tA</span></div></div>
      <div class="hero-bottom"><span>SCROLL TO DISCOVER THE ATLAS</span><span>↓</span></div>
    </section>
    <section class="manifesto"><p class="eyebrow">THE LINEARLENS METHOD / SEE → PLAY → CONNECT → DERIVE</p><div><h2>First see what changes.<br><em>Then prove why.</em></h2><p>Drag a direction. Collapse a plane. Watch an equation respond. Each finished laboratory leads directly into a full derivation, so geometric intuition and mathematical rigor grow together.</p></div></section>
    <section class="atlas-heading" id="chapters"><p class="eyebrow">THE ATLAS / FIVE WAYS TO SEE</p><h2>Explore the structure<br>of space.</h2><p>Begin with directions. Follow them through maps, hidden structure, and approximation.</p></section>
    <section class="chapters">${chapters.map(chapterBlock).join('')}</section>
    <section class="closing"><p class="eyebrow">START WITH A SINGLE TRANSFORMATION</p><h2>The whole plane<br>follows two arrows.</h2><a href="#/lesson/matrix" class="round-link" aria-label="Open matrix transformation lesson">↗</a></section>
  </main>${footer()}`;
  const scene = mountScene(document.querySelector('#home-scene')!, { home: true });
  cleanup = () => scene.destroy();
}

const lessonMeta: Record<LessonId, { chapter: string; index: string; title: string; intro: string; prompt: string; next: string; nextHref: string }> = {
  span: { chapter: 'SEEING SPACE', index: '01.01', title: 'SPAN, BASIS &<br>INDEPENDENCE', intro: 'A set of vectors can reveal a line, fill a plane, or quietly repeat the same direction.', prompt: 'Drag either generator. When do two arrows stop making two directions?', next: 'MATRIX AS A SPACE DEFORMER', nextHref: '#/lesson/matrix' },
  matrix: { chapter: 'SEEING TRANSFORMATIONS', index: '02.01', title: 'MATRIX AS A<br>SPACE DEFORMER', intro: 'Move two basis vectors. Watch an entire space obey.', prompt: 'Drag the red or blue arrow, edit the matrix, or move the free vector.', next: 'DETERMINANT', nextHref: '#/lesson/determinant' },
  determinant: { chapter: 'SEEING TRANSFORMATIONS', index: '02.02', title: 'DETERMINANT', intro: 'A single number measures how a map scales and orients area.', prompt: 'Move through a singularity. Watch area vanish, then orientation reverse.', next: 'SPAN, BASIS & INDEPENDENCE', nextHref: '#/lesson/span' },
};

function matrixControls() {
  return `<div class="lab-control-block"><div class="control-heading"><span>01 / MATRIX</span><span>DRAG Ae₁ OR Ae₂ IN THE SCENE</span></div>
    <div class="matrix-control"><span>A =</span><div class="matrix-bracket"><div class="matrix-grid">
      <label><span class="sr-only">Matrix entry a</span><input data-entry="a" type="number" step="0.05" value="1"></label>
      <label><span class="sr-only">Matrix entry b</span><input data-entry="b" type="number" step="0.05" value="0.8"></label>
      <label><span class="sr-only">Matrix entry c</span><input data-entry="c" type="number" step="0.05" value="0.12"></label>
      <label><span class="sr-only">Matrix entry d</span><input data-entry="d" type="number" step="0.05" value="1"></label>
    </div></div></div>
    <div class="live-values"><div class="wide-value"><span>A(t) / CURRENT MAP</span><strong id="current-matrix"></strong></div><div><span>det(A(t))</span><strong id="det-value">0.90</strong></div><div><span>rank(A(t))</span><strong id="rank-value">2</strong></div><div><span>A(t)v</span><strong id="vector-value">(0, 0)</strong></div></div>
  </div>
  <div class="lab-control-block"><div class="control-heading"><span>02 / TRANSFORM</span><span>CHOOSE A BEHAVIOR</span></div><div class="preset-grid">${Object.keys(presets).map(name => `<button class="preset-button" data-preset="${name}">${name}<span>↗</span></button>`).join('')}</div></div>
  <div class="lab-control-block"><div class="control-heading"><span>03 / ANIMATION</span><span>A(t) = (1 − t)I + tA</span></div><div class="transport"><button id="play-button" aria-label="Play animation">▶</button><button id="pause-button" aria-label="Pause animation">Ⅱ</button><button id="reset-button" aria-label="Reset animation">↺</button><input id="time-scrub" type="range" min="0" max="1" step="0.001" value="1" aria-label="Transformation progress"><span id="time-value">100%</span></div></div>`;
}

function spanControls() {
  return `<div class="lab-control-block"><div class="control-heading"><span>01 / GENERATORS</span><span>DRAG v₁ AND v₂</span></div><div class="live-values span-values"><div><span>v₁</span><strong id="span-u"></strong></div><div><span>v₂</span><strong id="span-w"></strong></div><div><span>dim(span)</span><strong id="span-dim"></strong></div><div><span>det[v₁ v₂]</span><strong id="span-area"></strong></div></div></div>
    <div class="lab-control-block"><div class="control-heading"><span>02 / EXPERIMENTS</span><span>CHANGE THE DIRECTIONS</span></div><div class="preset-grid">${['Independent', 'Dependent', 'One direction'].map(name => `<button class="preset-button" data-span-preset="${name}">${name}<span>↗</span></button>`).join('')}</div></div>
    <div class="lab-note"><span class="red-line"></span><p>The dots are sample combinations. The span includes <em>every</em> real combination of the generators.</p></div>`;
}

function renderLesson(id: LessonId) {
  const meta = lessonMeta[id];
  const isSpan = id === 'span';
  app.innerHTML = `${header(true)}<main>
    <section class="lesson-hero"><div class="lesson-hero-top"><span>ATLAS / ${meta.chapter}</span><span>LABORATORY ${meta.index}</span></div><div class="lesson-title-row"><div><p class="eyebrow">SEE → PLAY → CONNECT → DERIVE</p><h1>${meta.title}</h1></div><p>${meta.intro}</p></div></section>
    <section class="lab" aria-label="Interactive laboratory"><div class="lab-topline"><span>INTERACTIVE LABORATORY</span><span>${meta.index} / LIVE GEOMETRY</span></div><div class="lab-grid">
      <div class="lab-visual"><div id="lesson-scene" class="lesson-scene"></div><div class="scene-legend"><span><i class="legend-red"></i>${isSpan ? 'FIRST GENERATOR' : 'IMAGE OF e₁ / Av'}</span><span><i class="legend-blue"></i>${isSpan ? 'SECOND GENERATOR' : 'IMAGE OF e₂'}</span><span><i class="legend-cream"></i>${isSpan ? 'VECTOR SUM' : 'INPUT VECTOR'}</span></div></div>
      <aside class="lab-sidebar"><div class="lab-prompt"><span class="eyebrow">WHAT TO NOTICE</span><p>${meta.prompt}</p></div>${isSpan ? spanControls() : matrixControls()}</aside>
    </div><div class="lab-bottomline"><span>GEOMETRY ↔ ALGEBRA</span><a href="#theory">FOLLOW THE DERIVATION ↓</a></div></section>
    <div id="theory" class="theory">${theory[id]}</div>
    <section class="lesson-next"><span>CONTINUE THE ATLAS</span><a href="${meta.nextHref}">${meta.next}<span>↗</span></a></section>
  </main>${footer()}`;

  if (isSpan) {
    const scene: SpanHandle = mountSpanScene(document.querySelector('#lesson-scene')!, ([u, w]) => {
      const area = u.x * w.y - u.y * w.x;
      document.querySelector('#span-u')!.textContent = `(${fixed(u.x)}, ${fixed(u.y)})`;
      document.querySelector('#span-w')!.textContent = `(${fixed(w.x)}, ${fixed(w.y)})`;
      document.querySelector('#span-dim')!.textContent = String(rank({ a: u.x, b: w.x, c: u.y, d: w.y }));
      document.querySelector('#span-area')!.textContent = fixed(area);
    });
    app.querySelectorAll<HTMLButtonElement>('[data-span-preset]').forEach(button => button.addEventListener('click', () => scene.setPreset(button.dataset.spanPreset!)));
    cleanup = () => scene.destroy();
  } else {
    let scene: SceneHandle;
    const entries = ['a', 'b', 'c', 'd'] as const;
    const inputs = entries.map(key => app.querySelector<HTMLInputElement>(`[data-entry="${key}"]`)!);
    function updateControls() {
      if (!scene) return;
      const A = scene.state.target;
      const current = { a: 1 + (A.a - 1) * scene.state.t, b: A.b * scene.state.t, c: A.c * scene.state.t, d: 1 + (A.d - 1) * scene.state.t };
      inputs.forEach((input, i) => { if (document.activeElement !== input) input.value = fixed(A[entries[i]]); });
      document.querySelector('#current-matrix')!.textContent = `[${fixed(current.a)}  ${fixed(current.b)} ; ${fixed(current.c)}  ${fixed(current.d)}]`;
      document.querySelector('#det-value')!.textContent = fixed(det(current));
      document.querySelector('#rank-value')!.textContent = String(rank(current));
      const image = apply(current, scene.state.vector);
      document.querySelector('#vector-value')!.textContent = `(${fixed(image.x)}, ${fixed(image.y)})`;
      const scrub = document.querySelector<HTMLInputElement>('#time-scrub')!;
      if (document.activeElement !== scrub) scrub.value = String(scene.state.t);
      document.querySelector('#time-value')!.textContent = `${Math.round(scene.state.t * 100)}%`;
      app.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach(button => button.classList.toggle('active', button.dataset.preset === Object.keys(presets).find(key => JSON.stringify(presets[key]) === JSON.stringify(A))));
    }
    scene = mountScene(document.querySelector('#lesson-scene')!, { initial: id === 'determinant' ? presets.Singular : presets.Shear, onChange: updateControls });
    updateControls();
    inputs.forEach(input => input.addEventListener('input', () => {
      const values = inputs.map(field => Number(field.value));
      if (values.some(value => !Number.isFinite(value))) return;
      scene.setMatrix({ a: values[0], b: values[1], c: values[2], d: values[3] }, false);
    }));
    app.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach(button => button.addEventListener('click', () => scene.setMatrix(presets[button.dataset.preset!])));
    app.querySelector<HTMLButtonElement>('#play-button')!.addEventListener('click', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scene.state.t = reduced ? 1 : 0;
      scene.state.playing = !reduced;
      scene.render();
    });
    app.querySelector<HTMLButtonElement>('#pause-button')!.addEventListener('click', () => { scene.state.playing = false; scene.render(); });
    app.querySelector<HTMLButtonElement>('#reset-button')!.addEventListener('click', () => { scene.state.playing = false; scene.state.t = 0; scene.render(); });
    app.querySelector<HTMLInputElement>('#time-scrub')!.addEventListener('input', event => { scene.state.playing = false; scene.state.t = Number((event.target as HTMLInputElement).value); scene.render(); });
    cleanup = () => scene.destroy();
  }
}

function route() {
  cleanup?.();
  cleanup = undefined;
  const match = location.hash.match(/^#\/lesson\/(span|matrix|determinant)$/);
  if (match) renderLesson(match[1] as LessonId);
  else renderHome();
  window.scrollTo(0, location.hash === '#/chapters' ? document.querySelector('#chapters')?.getBoundingClientRect().top ?? 0 : 0);
  if (location.hash === '#/chapters') document.querySelector('#chapters')?.scrollIntoView();
}
window.addEventListener('hashchange', route);
route();
