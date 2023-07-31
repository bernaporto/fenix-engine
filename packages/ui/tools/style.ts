const rootStyles = `
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  font-size: 10px;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  /* Disable text selection */
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */

  --font-size-small: 1.2rem;
  --font-size-medium: 1.4rem;
  --font-size-large: 1.7rem;
  --font-size-xl: 2rem;
}

/* All text elements should have at least 1.4rem of font-size */
p,
span,
div,
a,
button,
input,
label,
select,
textarea {
  font-size: var(--font-size-medium);
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
`;

export const applyRootStyles = (): void =>
  applyStyles(document.head, rootStyles);

export const applyStyles = (root: Node, styles: string): void => {
  const styleEl = document.createElement('style');
  root.appendChild(styleEl);

  styleEl.innerHTML = styles.trim();
};
