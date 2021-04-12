const OAuth = require("./oauth");

const render = ({ title, scripts =[], styles = [] }) => {
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
    <div class="container">
      <div class="login-content">
        <div class="logo">FromKorea | Log in</div>
        <div class="oauth">
          ${OAuth.googleLogin()}
          ${OAuth.fbLogin()}
        </div>
      </div>
    </div>
    ${scripts.join("\n")}
    ${process.env.NODE_ENV === "dev" ? `<script src="//localhost:35729/livereload.js?snipver=1" async defer></script>` : ""}
  </body>
  </html>`;
}

module.exports = {
  render
}