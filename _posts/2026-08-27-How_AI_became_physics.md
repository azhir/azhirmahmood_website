---

title: "How AI Became the New Physics"
date: 2026-08-27
category: "Artificial Intelligence"

abstract: >
  Why understanding modern AI is starting to resemble the study
  of complex physical systems.

image: /assets/images/posts/ai-new-physics.jpg
image_alt: "The 1927 Solvay Conference"

tags:
  - AI
  - machine-learning
  - science

image: https://upload.wikimedia.org/wikipedia/commons/6/6e/Solvay_conference_1927.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original
image_alt: "The 1927 Solvay Conference"

published: true
---


Physics and AI share a deep history, in some respects one could argue that 21st century machine learning scientists are arguably at the forefronts of science similiar to physicists in the early 20th century. 

<style>
.solvay-image {
  width: 85%;
  display: block;
  margin: 2rem auto;
}
</style>

The works of Geoffry Hinton  



![1927 Solvay Conference](https://upload.wikimedia.org/wikipedia/commons/6/6e/Solvay_conference_1927.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original){: .solvay-image }


This is the first post. It's here mostly to prove the pipeline works end
to end: Markdown in, a properly typeset page out — LaTeX included.

## Inline math

You can write inline math like $e^{i\pi} + 1 = 0$ right in a sentence,
and it renders in place, at reading size, without breaking the line height.

## Display math

For anything that deserves its own line, use display math:

$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}, \qquad \operatorname{Re}(s) > 1
$$

Multi-line derivations work too, using `aligned`:

$$
\begin{aligned}
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

## Code, too

Since a lot of what's worth writing down is code, not just math:

```python
def zeta_partial(s, n_terms=10_000):
    return sum(1 / n**s for n in range(1, n_terms + 1))
```

> A blockquote, for asides, caveats, or things I want to walk back later.

That's the whole toolkit: headings, inline and display LaTeX, code blocks,
and blockquotes. Delete this post once you've got a real first entry.
