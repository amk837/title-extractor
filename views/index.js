import { html } from 'html-express-js';
const header = `
  <html>
    <head></head>
    <body>
    <h1>Following are the titles of given websites:</h1>
    <ul>
`;

const footer = `
    </ul>
    </body>
  </html>
`;

export const view = ({ urlWithTitles }, state) => html`
  ${header}
  ${urlWithTitles.map(({ url, title }) => `<li>${url} - "${title}"</li>`).join('')}
  ${footer}
`;
