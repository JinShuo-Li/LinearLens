# LinearLens

**See the Geometry Behind Linear Algebra.**

An interactive toolkit for building geometric intuition in linear algebra.

LinearLens treats matrices as maps of space. Students first see and manipulate a geometric phenomenon, read the live algebra beside it, and then work through a detailed derivation.

## Explore

The current complete lessons are:

- **Span, basis, and independence:** drag generators and watch the reachable set change dimension.
- **Matrix as a space deformer:** move the image basis vectors, transform a grid, circle, square, and free vector, and derive the column rule.
- **Determinant:** watch oriented area pass through a singularity and derive \(ad-bc\).

The atlas shows the planned chapter sequence; unfinished topics are labeled **In development** and do not lead to placeholder lessons. The next priorities are rank, kernel, and image in 3D, then linear systems and the invertibility synthesis.

## Run locally

Requires Node.js 22 or later.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. The app uses hash navigation so lessons work on GitHub Pages without server rewrites.

```bash
npm test
npm run build
npm run preview
```

See [Development guide](docs/development.md) for structure and lesson requirements.

## Deploy

The production base path is `/LinearLens/`. The Pages workflow builds and deploys on pushes to `main` after tests pass. See [Deployment guide](docs/deployment.md).

## Mathematical sources

The primary narrative follows Jinshuo Li's course notes:

- `MATH1409-Linear-Algebra-for-AI/la/main.tex`, *Linear Algebra from the Perspective of Linear Transformations*;
- `MATH1205-Linear-Algebra/Linear-Algebra/LA.tex`, *Linear Algebra Final Review*.

The requested PDF filenames were not present in the accessible workspace; these TeX sources were available in `~/work/Courses`. The lessons paraphrase their conceptual structure and supply new geometric exposition and derivations. See [Content source notes](docs/content-sources.md).

## License

MIT. See [LICENSE](LICENSE).
