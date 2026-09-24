import katex from 'katex';

const m = (source: string) => katex.renderToString(source, { throwOnError: false, displayMode: false });
const eq = (source: string) => `<div class="equation">${katex.renderToString(source, { throwOnError: false, displayMode: true })}</div>`;
const step = (number: string, title: string, body: string) =>
  `<div class="derivation-step"><span class="step-number">${number}</span><div><h4>${title}</h4>${body}</div></div>`;

export const theory: Record<string, string> = {
  matrix: `
    <section class="theory-intro">
      <p class="eyebrow">THEORY & DERIVATION / 02.01</p>
      <h2>Why the columns<br><em>move the whole plane.</em></h2>
      <p class="lead">In the laboratory above, moving the red and blue image basis vectors moved every grid line, the unit circle, and the free vector together. The reason is exact: once a linear map's action on a basis is known, no freedom remains in its action anywhere else.</p>
    </section>
    <section class="theory-section">
      <div class="section-aside"><span>01 / GEOMETRIC IDEA</span><div class="mini-rule"></div><p>Two arrows determine an entire linear world.</p></div>
      <div class="section-copy">
        <h3>Read a matrix by its columns</h3>
        <p>Take the standard basis ${m('e_1=(1,0)^T')} and ${m('e_2=(0,1)^T')}. For ${m('A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}')}, the first column is ${m('Ae_1=(a,c)^T')} and the second is ${m('Ae_2=(b,d)^T')}. Those are the red and blue arrows in the scene. The grid is transformed by applying the same rule to every point on every grid line.</p>
        ${eq(String.raw`A e_1=\begin{bmatrix}a\\c\end{bmatrix},\qquad A e_2=\begin{bmatrix}b\\d\end{bmatrix}.`)}
        <p>Notice that the transformed unit square has vertices ${m('0, Ae_1, Ae_1+Ae_2, Ae_2')}. It becomes a parallelogram because vector addition survives the transformation.</p>
      </div>
    </section>
    <section class="theory-section pale">
      <div class="section-aside"><span>02 / FORMAL DEFINITION</span><div class="mini-rule"></div><p>Linearity is a rule about combinations.</p></div>
      <div class="section-copy">
        <h3>What makes a map linear?</h3>
        <p>A map ${m('T:V\\to W')} between vector spaces is linear if, for every ${m('u,v\\in V')} and scalar ${m('\\alpha')}, it respects addition and scaling:</p>
        ${eq(String.raw`T(u+v)=T(u)+T(v),\qquad T(\alpha u)=\alpha T(u).`)}
        <p>Combining these two rules gives ${m('T(\\alpha u+\\beta v)=\\alpha T(u)+\\beta T(v)')}. In particular, ${m('T(0)=0')}; a map that shifts the origin is not linear. A matrix represents a linear map after bases for the input and output spaces have been chosen.</p>
      </div>
    </section>
    <section class="theory-section">
      <div class="section-aside"><span>03 / WHY IT WORKS</span><div class="mini-rule"></div><p>Follow one arbitrary point through the map.</p></div>
      <div class="section-copy">
        <h3>Derive the column rule</h3>
        ${step('01', 'Resolve the input into basis directions.', `<p>Every ${m('v=(x,y)^T')} has the unique decomposition ${m('v=xe_1+ye_2')}. The numbers ${m('x,y')} are coordinates: how much of each basis direction is needed.</p>`)}
        ${step('02', 'Apply linearity to the combination.', `<p>The map must distribute over the sum and allow each scalar to pass through:</p>${eq(String.raw`T(v)=T(xe_1+ye_2)=xT(e_1)+yT(e_2).`)}`)}
        ${step('03', 'Insert the two observed basis images.', `<p>When ${m('T(e_1)=(a,c)^T')} and ${m('T(e_2)=(b,d)^T')},</p>${eq(String.raw`T(v)=x\begin{bmatrix}a\\c\end{bmatrix}+y\begin{bmatrix}b\\d\end{bmatrix}
        =\begin{bmatrix}ax+by\\cx+dy\end{bmatrix}
        =\begin{bmatrix}a&b\\c&d\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}.`)}`)}
        ${step('04', 'Return to the moving grid.', `<p>A grid line parallel to ${m('e_1')} is a family of points ${m('p+te_1')}. Its image is ${m('T(p)+tT(e_1)')}: another straight line, now parallel to the red image basis vector. This is why the whole grid moves coherently when you drag that arrow.</p>`)}
      </div>
    </section>
    <section class="theory-section pale">
      <div class="section-aside"><span>04 / WORKED EXAMPLE</span><div class="mini-rule"></div><p>One shear, computed two ways.</p></div>
      <div class="section-copy">
        <h3>From columns to an image</h3>
        <p>Choose the Shear preset: ${m('A=\\begin{bmatrix}1&0.8\\\\0.12&1\\end{bmatrix}')}. The basis images are ${m('Ae_1=(1,0.12)^T')} and ${m('Ae_2=(0.8,1)^T')}. For ${m('v=(2,1)^T')}, add two copies of the first image to one copy of the second:</p>
        ${eq(String.raw`A\begin{bmatrix}2\\1\end{bmatrix}
        =2\begin{bmatrix}1\\0.12\end{bmatrix}
        +\begin{bmatrix}0.8\\1\end{bmatrix}
        =\begin{bmatrix}2.8\\1.24\end{bmatrix}.`)}
        <p>Drag the free vector to ${m('(2,1)')} in the laboratory and check its red image. Matrix multiplication and the parallelogram construction describe the same point.</p>
      </div>
    </section>
    <section class="theory-section">
      <div class="section-aside"><span>05 / CONNECTIONS</span><div class="mini-rule"></div><p>Structure persists; dimensions may not.</p></div>
      <div class="section-copy">
        <h3>What this opens up</h3>
        <p>The matrix columns are the images of a basis. Their span is therefore the <strong>image</strong> of the map. If they become dependent, the plane collapses to a line: rank falls, determinant becomes zero, and some nonzero input direction enters the kernel. These are several descriptions of one geometric event.</p>
        <div class="insight"><b>Common misconception</b><p>“A matrix is the transformation itself.” A matrix is the coordinate description of a transformation after bases are chosen. Change the bases and its entries can change while the underlying map stays the same.</p></div>
        <div class="insight"><b>Further insight</b><p>The column argument works in any finite dimension. For ${m('v=\\sum_i x_i e_i')}, linearity forces ${m('T(v)=\\sum_i x_iT(e_i)')}. This is why finite matrices can encode maps between spaces of different dimensions.</p></div>
      </div>
    </section>`,
  determinant: `
    <section class="theory-intro"><p class="eyebrow">THEORY & DERIVATION / 02.02</p><h2>The area remembers<br><em>orientation.</em></h2><p class="lead">Watch the unit square become a parallelogram. Its signed area is the determinant: magnitude measures area scale; sign records whether the transformed basis keeps its counterclockwise order.</p></section>
    <section class="theory-section"><div class="section-aside"><span>01 / GEOMETRIC IDEA</span><div class="mini-rule"></div><p>The square is a measuring instrument.</p></div><div class="section-copy"><h3>Stretch, reverse, collapse</h3><p>The original unit square has area one. Under ${m('A')}, its edge vectors become ${m('Ae_1=(a,c)^T')} and ${m('Ae_2=(b,d)^T')}. Their parallelogram has unsigned area ${m('|\\det A|')}. A negative determinant means the ordered pair has reversed orientation. At zero, the two edges lie on one line and the area disappears.</p><p>Try Reflection, then Singular. Watch the live sign and area follow the picture continuously.</p></div></section>
    <section class="theory-section pale"><div class="section-aside"><span>02 / FORMAL DEFINITION</span><div class="mini-rule"></div><p>Signed area of ordered columns.</p></div><div class="section-copy"><h3>Define the 2×2 determinant</h3><p>For a real ${m('2\\times2')} matrix with column vectors ${m('u=(a,c)^T')} and ${m('w=(b,d)^T')}, its determinant is their oriented area:</p>${eq(String.raw`\det A=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc.`)}<p>This quantity is linear in each column separately, changes sign when columns are swapped, and equals one for the standard basis. Those properties capture oriented area.</p></div></section>
    <section class="theory-section"><div class="section-aside"><span>03 / WHY IT WORKS</span><div class="mini-rule"></div><p>Break the area into coordinate pieces.</p></div><div class="section-copy"><h3>Derive ${m('ad-bc')}</h3>
      ${step('01','Express both edges in the standard basis.',`<p>Write ${m('u=ae_1+ce_2')} and ${m('w=be_1+de_2')}. The area depends bilinearly on these edges.</p>`)}
      ${step('02','Expand the oriented area.',`<p>Using bilinearity and writing ${m('[u,w]')} for oriented area,</p>${eq(String.raw`[u,w]=ab[e_1,e_1]+ad[e_1,e_2]+cb[e_2,e_1]+cd[e_2,e_2].`)}`)}
      ${step('03','Remove zero and reversed pieces.',`<p>Parallel pairs enclose no area: ${m('[e_1,e_1]=[e_2,e_2]=0')}. The standard pair has area ${m('[e_1,e_2]=1')}; swapping it gives ${m('[e_2,e_1]=-1')}. Therefore</p>${eq(String.raw`[u,w]=ad-bc.`)}`)}
      ${step('04','Interpret the vanishing area.',`<p>If ${m('ad-bc=0')}, the transformed columns have zero oriented area. In two dimensions that means they are dependent, so the entire transformed plane lies on a line or at the origin. The inverse cannot restore the lost direction.</p>`)}
    </div></section>
    <section class="theory-section pale"><div class="section-aside"><span>04 / WORKED EXAMPLE</span><div class="mini-rule"></div><p>Cross the singular boundary.</p></div><div class="section-copy"><h3>A controlled collapse</h3><p>Set ${m('A=\\begin{bmatrix}1&1\\\\0&t\\end{bmatrix}')}. The red edge is ${m('(1,0)')}, the blue edge is ${m('(1,t)')}, and the parallelogram has signed area</p>${eq(String.raw`\det A=1\cdot t-1\cdot0=t.`)}<p>When ${m('t>0')}, orientation is preserved. At ${m('t=0')}, both edges point along the same horizontal line. When ${m('t<0')}, the orientation reverses. Edit the lower right entry while the other entries remain fixed to see all three cases.</p></div></section>
    <section class="theory-section"><div class="section-aside"><span>05 / CONNECTIONS</span><div class="mini-rule"></div><p>One event, several theorems.</p></div><div class="section-copy"><h3>Area, rank, and inverse</h3><p>For a square ${m('2\\times2')} map, ${m('\\det A\\ne0')} means its columns are independent and span the output plane. Its rank is two, its kernel contains only zero, and every output has exactly one input. The determinant is thus a compact test for invertibility, though its magnitude also carries the separate geometric fact of area scaling.</p><div class="insight"><b>Common misconception</b><p>A negative determinant does not mean “negative area.” Ordinary area is ${m('|\\det A|')}; the sign stores orientation.</p></div><div class="insight"><b>Further insight</b><p>In three dimensions, the same idea gives signed volume of the parallelepiped formed by three image basis vectors. Volume zero signals dimension loss.</p></div></div></section>`,
  span: `
    <section class="theory-intro"><p class="eyebrow">THEORY & DERIVATION / 01.01</p><h2>How many directions<br><em>are really there?</em></h2><p class="lead">Drag the two generating arrows. When they cease to point in independent directions, the filled plane of combinations collapses to a line. That visual collapse is the algebra of dependence.</p></section>
    <section class="theory-section"><div class="section-aside"><span>01 / GEOMETRIC IDEA</span><div class="mini-rule"></div><p>Combinations draw the reachable set.</p></div><div class="section-copy"><h3>From arrows to a space</h3><p>One nonzero vector generates a line through the origin by scaling. Two nonparallel vectors allow movement in two directions, reaching every point of the plane. If the vectors become parallel, the second adds no new direction. The lattice in the laboratory shows sample sums ${m('s v_1+t v_2')}; the span includes every real choice of ${m('s,t')}, not just the drawn samples.</p></div></section>
    <section class="theory-section pale"><div class="section-aside"><span>02 / FORMAL DEFINITION</span><div class="mini-rule"></div><p>The smallest subspace containing the vectors.</p></div><div class="section-copy"><h3>Define span and independence</h3>${eq(String.raw`\operatorname{span}\{v_1,\ldots,v_k\}=\left\{\sum_{i=1}^{k}a_i v_i:a_i\in\mathbb R\right\}.`)}<p>The vectors are linearly independent if ${m('a_1v_1+\\cdots+a_kv_k=0')} forces every ${m('a_i=0')}. They form a basis of a space when they both span it and are independent. Its dimension is the number of vectors in any basis.</p></div></section>
    <section class="theory-section"><div class="section-aside"><span>03 / WHY IT WORKS</span><div class="mini-rule"></div><p>Redundancy removes a degree of freedom.</p></div><div class="section-copy"><h3>Derive the collapse</h3>
      ${step('01','Begin with every combination.',`<p>In the plane, ${m('s v_1+t v_2')} describes all reachable points as the two coefficients vary independently.</p>`)}
      ${step('02','Suppose the second arrow is redundant.',`<p>If ${m('v_2=cv_1')}, then</p>${eq(String.raw`s v_1+t v_2=s v_1+tc v_1=(s+ct)v_1.`)}<p>Only one effective coefficient remains. Every result lies on the line through ${m('v_1')}.</p>`)}
      ${step('03','Reverse the argument for nonparallel arrows.',`<p>Put the arrows into a matrix ${m('B=[v_1\ v_2]')}. If they are nonparallel, its determinant is nonzero and ${m('B^{-1}')} exists. For any target ${m('w')}, the coefficients ${m('(s,t)^T=B^{-1}w')} reach it. Hence the span is the whole plane.</p>`)}
      ${step('04','Identify a basis.',`<p>The independent pair spans the plane without redundancy, so it is a basis and the plane has dimension two. At collapse, only one independent direction survives and the span has dimension one.</p>`)}
    </div></section>
    <section class="theory-section pale"><div class="section-aside"><span>04 / WORKED EXAMPLE</span><div class="mini-rule"></div><p>One pair, then a redundant replacement.</p></div><div class="section-copy"><h3>Test the target ${m('(5,4)')}</h3><p>Take ${m('v_1=(1,1)')} and ${m('v_2=(2,1)')}. Solve ${m('s(1,1)+t(2,1)=(5,4)')}: ${m('s+2t=5')} and ${m('s+t=4')}, so ${m('t=1,s=3')}. The target is reachable. The determinant ${m('1\\cdot1-2\\cdot1=-1')} confirms independence.</p><p>Replace ${m('v_2')} with ${m('(2,2)=2v_1')}. Now every combination has equal coordinates, so ${m('(5,4)')} is unreachable. The second arrow did not increase the span.</p></div></section>
    <section class="theory-section"><div class="section-aside"><span>05 / CONNECTIONS</span><div class="mini-rule"></div><p>Basis is the bridge to matrices.</p></div><div class="section-copy"><h3>From span to transformation</h3><p>The columns of a matrix are the images of basis vectors, so their span is exactly the map's image. The number of independent columns is its rank. If a column is redundant, some nonzero combination of input basis vectors maps to zero: that combination lies in the kernel.</p><div class="insight"><b>Common misconception</b><p>Two vectors do not automatically span a plane. They must point in independent directions; two parallel arrows still generate only a line.</p></div><div class="insight"><b>Further insight</b><p>In three dimensions, three independent vectors generate volume. A dependent third vector stays inside the plane already generated by the first two. The same redundancy test extends to every finite dimension.</p></div></div></section>`,
};
