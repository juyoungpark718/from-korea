const render = ({ title = "From korea", styles = [], body = "", scripts = [] }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/assets/global/style.css"/>
    ${styles.join("\n")}
    <title>${title}</title>
  </head>
  <body>
    <header class="header">
      <div class="header__top">
        <div class="header__top__menu">
          <div class="header__top__menu__item">register</div>
          <div class="header__top__menu__item">login</div>
          <div class="header__top__menu__item">Anouncement</div>
          <div class="header__top__menu__item">Help Center</div>
        </div>
      </div>
      <div class="header__inner">
        <div class="header__log">From Korea</div>
        <div class="header__search">
          <input class="header__search__input" type="text" placeholder="Search / Paste Url" />
        </div>
        <div class="header__user">
          <img src="./images/reorder-four-outline.svg" />
          <div class="menu">
            <div class="menu__inner">
              <div class="menu__inner__item--mobile">로고</div>
              <div class="menu__inner__item--mobile">로그인 / 회원가입</div>
              <div class="menu__inner__item">My Cart</div>
              <div class="menu__inner__item">My page</div>
              <div class="menu__inner__item">My Wallet</div>
              <div class="menu__inner__item--mobile">Help Center</div>
            </div>
          </div>
        </div>
      </div>
    </header>
    ${body}
    <script src="https://unpkg.com/fxdom/dist/fxd.js"></script>
    <script src="https://unpkg.com/fxjs/dist/fx.js"></script>
    ${scripts.join("\n")}
    ${process.env.NODE_ENV === "dev" ? `<script src="//localhost:35729/livereload.js?snipver=1" async defer></script>` : ""}
  </body>
  </html>`;
}

module.exports = {
  render,
}