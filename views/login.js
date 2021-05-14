const OAuth = require("./oauth");
const Footer = require("./footer");

const render = ({ title, scripts = [], styles = [] }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${styleSheet`global/style.css`}
    ${styles.join("\n")}
    <title>${title}</title>
  </head>
  <body>
    <header class="login-header">
      <div class="login-header__logo">From. Korea</div>
    </header>
    <main class="login-container">
      <div class="login-content">
        <div class="login-content__logo-wrapper">
          <div class="login-content__logo">
            <h2>From. Korea</h2>
            <h4>Could you choose a login method?</h4>
          </div>
        </div>
        <div class="oauth">
          ${OAuth.googleLogin()}
          ${OAuth.fbLogin()}
        </div>
      </div>
    </main>
    ${Footer.render()}
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
