const publicHeader = () => {
  return `
  <header class="header">
    <div class="header__top">
      <div class="header__top__menu">
        <a href="/user"><div class="header__top__menu__item">Login</div></a>
        <div class="header__top__menu__item">Anouncement</div>
        <div class="header__top__menu__item">Help Center</div>
      </div>
    </div>
    <div class="header__inner">
      <div class="header__logo">From. Korea</div>
      <div class="header__search">
        <input class="header__search__input" type="text" placeholder="Search / Paste Url" />
      </div>
      <div class="header__user">
        <img src="./images/reorder-four-outline.svg" />
        <div class="menu">
          <div class="menu__inner">
            <div class="menu__inner__item--mobile">로고</div>
            <div class="menu__inner__item--mobile">로그인</div>
            <div class="menu__inner__item">
              <img src="/images/cart-outline.svg" alt="mycart"/>
            </div>
            <div class="menu__inner__item">
              <img src="/images/person-outline.svg" alt="mypage"/>
            </div>
            <div class="menu__inner__item">
              <img src="/images/wallet-outline.svg" alt="mywallet"/>
            </div>
            <div class="menu__inner__item--mobile">Help Center</div>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

const privateHeader = (user) => {
  return `
  <header class="header">
    <div class="header__top">
      <div class="header__top__menu">
        <a href="/user/logout"><div class="header__top__menu__item">Logout</div></a>
        <div class="header__top__menu__item">Anouncement</div>
        <div class="header__top__menu__item">Help Center</div>
      </div>
    </div>
    <div class="header__inner">
      <div class="header__log">From. Korea</div>
      <div class="header__search">
        <input class="header__search__input" type="text" placeholder="Search / Paste Url" />
      </div>
      <div class="header__user">
        <img src="./images/reorder-four-outline.svg" />
        <div class="menu">
          <div class="menu__inner">
            <div class="menu__inner__item--mobile">로고</div>
            <a href="/user/logout"><div class="menu__inner__item--mobile">로그아웃</div></a>
            <div class="menu__inner__item">My Cart</div>
            <div class="menu__inner__item">My page</div>
            <div class="menu__inner__item">My Wallet</div>
            <div class="menu__inner__item--mobile">Help Center</div>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

const render = (user) => {
  return user ? privateHeader(user) : publicHeader();
}

module.exports = {
  render
}