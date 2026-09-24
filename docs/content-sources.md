# Content source notes

The requested `LA(1).pdf` and `la_final.pdf` were not found in the accessible workspace. The course repository under `~/work/Courses` supplied the corresponding TeX material:

- `MATH1409-Linear-Algebra-for-AI/la/main.tex`: begins from linear maps and develops kernel, image, rank, nullity, projection, orthogonality, rotations, and structural decompositions.
- `MATH1205-Linear-Algebra/Linear-Algebra/LA.tex`: formal definitions and results for spans, bases, coordinate changes, matrices of linear maps, similarity, eigenvectors, quadratic forms, and a summary of rank interpretations.

The content architecture keeps their central connections: a matrix stores basis images; rank is the dimension of the image and the count of surviving independent directions; kernel records lost directions; determinant zero and dependent columns indicate dimension loss; a basis change alters coordinates but preserves the map.

The finished lessons rework those ideas around manipulable geometry and supply stepwise derivations. The oriented area expansion and SVG laboratory presentation are new exposition. Future material such as SVD, condition numbers, and low rank approximation will be marked as an extension where it goes beyond these notes.

The source notes contain occasional informal wording about the direction of a basis change. LinearLens uses the convention that the columns of `P` are the new basis vectors in old coordinates, so `[x]_{old}=P[x]_{new}` and `A_{new}=P^{-1}A_{old}P`.
