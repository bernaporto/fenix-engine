# Copilot Instructions

## Working process

- System architecture is the top priority. Always plan first and implement later, once all the pieces are clear.
- Work on one task at a time. Avoid implementing large chunks or multiple features at once.
- Before making changes, highlight what you plan to do and wait for explicit approval before executing.
- In case of conflicts or dubious solutions, raise them immediately. Do not decide architecture alone.
- Do not use the question/answer form tool. Ask questions inline, as part of the conversation, and wait for the reply.

## Commits

- When asked to move forward, if there are pending changes, commit the work in meaningful chunks before proceeding.
- Add a decision log to each commit description explaining the "why" behind the choices made, so the reasoning can be tracked over time.

## React components

- Components are dumb: they only compose visuals.
- State and business logic live outside components and must be unit tested.
- Never create component tests.
- Avoid deeply nested components or JSX. If a component branches, plan sub-components in the same file.
- Avoid prop drilling. If something is shareable, prefer a context.

## Code style

- Always prefer "exit-early" composition, for both regular functions and components.

## File organization

- In large files with many functions, organize code into sections using a comment such as `/* ---- Section Name ---- */`. Pad with `-` so the comment is exactly as wide as the default code style line width (80 characters).
- When a file has multiple functions, put the most relevant ones at the top so they are immediately visible when opening the file. Files are ES modules, so hoisting is not a concern.
- Do not export defensively. Only export what is needed outside the module.

## Styling

- Avoid inline visual styling. Code-driven values (such as an element's position or a size computed from data) may go in the `style` attribute.
- Write CSS files related to each component and import them directly in that component.
- Do not put all app styling in a single file.
