# Deployment guide

## GitHub Pages

1. Push the repository to `JinShuo-Li/LinearLens` on the `main` branch.
2. In repository settings, open **Pages** and select **GitHub Actions** as the build and deployment source.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.
4. Visit `https://JinShuo-Li.github.io/LinearLens/`.

The workflow runs `npm ci`, `npm test`, and `npm run build`, then deploys `dist`. Vite is configured with `base: '/LinearLens/'`, and page navigation uses hash routes such as `#/lesson/matrix`.

## Local production check

```bash
npm run build
npm run preview
```

Open the preview URL with `/LinearLens/` appended if Vite does not print the base path.
