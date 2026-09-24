# Development guide

## Stack and structure

LinearLens is a static Vite and TypeScript app. KaTeX renders lesson equations, and SVG provides precise, directly manipulable 2D geometry. No backend is required.

- `src/main.ts` contains hash routing, page layout, live controls, and the atlas.
- `src/scene.ts` renders the reusable matrix transformation scene.
- `src/spanScene.ts` renders linear combinations and draggable generators.
- `src/math.ts` contains small matrix and vector operations, separate from SVG state.
- `src/content.ts` contains the finished derivations.
- `src/style.css` defines the original editorial design system and responsive rules.
- `src/math.test.ts` checks exact small examples for determinant, rank, kernel, projection, and coordinate changes.

## Lesson completion standard

A lesson is ready for navigation only when its geometry, live algebra, and detailed derivation agree. Its theory must include a geometric idea, formal definition, explained derivation, worked example, connections, a misconception, and a return to the visual experiment.

Keep examples small and mathematically transparent. For higher dimensional decompositions, use a stable numerical library rather than expanding the small 2D helpers beyond their appropriate scope. Label numerical tolerances whenever a displayed classification depends on them.

## Commands

```bash
npm ci
npm run dev
npm test
npm run build
```

The Vite base path is `/LinearLens/`; check links under that path before deployment. Hash routes avoid GitHub Pages fallback requirements.

## Design principles

The site uses editorial scale, stark section transitions, generous whitespace, and a restrained red accent. Large geometry surfaces carry the first impression; controls are compact. SVG objects represent actual matrix operations, not decorative approximations. Motion respects `prefers-reduced-motion`.
