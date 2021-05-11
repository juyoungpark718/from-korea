const Header = require("./header");
const Footer = require("./footer");

const render = ({ title = "From korea", user, styles = [], body = "", scripts = [] }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${[styleSheet`global/style.css`, styleSheet`layout/style.css`].join("\n")}
    ${styles.join("\n")}
    <title>${title}</title>
  </head>
  <body>
    ${Header.render(user)}
    ${body}
    ${Footer.render()}
    <script src="https://unpkg.com/fxdom/dist/fxd.js"></script>
    <script src="https://unpkg.com/fxjs/dist/fx.js"></script>
    ${scripts.join("\n")}
    ${
      process.env.NODE_ENV === "dev"
        ? `<script src="//localhost:35729/livereload.js?snipver=1" async defer></script>`
        : ""
    }
  </body>
  </html>`;
};

module.exports = {
  render,
};
