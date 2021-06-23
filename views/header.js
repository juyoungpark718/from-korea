const publicHeader = () => {
  return `
  <header class="header">
    <div class="header__top-wrapper">
      <div class="header__top">
        <div class="header__top__menu">
          <a href="/user"><div class="header__top__menu__item">Login</div></a>
          <div class="header__top__menu__item">Anouncement</div>
          <div class="header__top__menu__item">Help Center</div>
        </div>
      </div>
    </div>
    <div class="header__inner">
      <div class="group-flex">
        <div class="header__logo"><a href="/">From. Korea</a></div>
        <div class="header__search">
          <input class="header__search__input" type="text" placeholder="Search / Paste Url" />
        </div>
        <div class="header__user">
          <img src="./images/reorder-four-outline.svg" />
          <div class="menu">
            <div class="menu__inner">
              <span class="menu__inner__x-btn">X</span>
              <div class="menu__inner__item__logo menu__inner__item--mobile">From. Korea</div>
              <div class="menu__inner__item__login menu__inner__item--mobile">
                <div class="login__item">
                  <div class="login__item__btn login__item--google">Google</div>
                </div>
                <div class="login__item">
                  <div class="login__item__btn login__item--fb">Facebook</div>
                </div>
              </div>
              <div class="menu__inner__item">
                <a href="/cart"><img class="menu__inner__item__img" src="/images/cart-outline.svg" alt="mycart"/></a>
                <a href="/cart"><span class="menu__inner__item__text">My cart</span></a>
              </div>
              <div class="menu__inner__item">
                <img class="menu__inner__item__img" src="/images/person-outline.svg" alt="mypage"/>
                <span class="menu__inner__item__text">My page</span>
              </div>
              <div class="menu__inner__item">
                <img class="menu__inner__item__img" src="/images/wallet-outline.svg" alt="mywallet"/>
                <span class="menu__inner__item__text">My wallet</span>
              </div>
              <div class="menu__inner__item menu__inner__item--mobile">Help Center</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="header__bottom__wrapper">
        <div class="header__bottom__menu">
          <div>
            <a>Home</a>
          </div>
          <div>
            <a>Categories</a>
          </div>
          <div>
            <a>Products</a>
          </div>
        </div>
      </div>
    </div>
  </header>`;
};

const privateHeader = (user) => {
  return `
  <header class="header">
    <div class="header__top">
      <div class="header__top__menu">
        <div class="header__top__menu__item">${user.name}</div>
        <a href="/user/logout"><div class="header__top__menu__item">Logout</div></a>
        <div class="header__top__menu__item">Anouncement</div>
        <div class="header__top__menu__item">Help Center</div>
      </div>
    </div>
    <div class="header__inner">
      <div class="group-flex">
        <div class="header__logo"><a href="/">From. Korea</a></div>
        <div class="header__search">
          <input class="header__search__input" type="text" placeholder="Search / Paste Url" />
        </div>
        <div class="header__user">
          <img src="./images/reorder-four-outline.svg" />
          <div class="menu">
            <div class="menu__inner">
              <span class="menu__inner__x-btn">X</span>
              <div class="menu__inner__item__logo menu__inner__item--mobile">From. Korea</div>
              <div class="menu__inner__item__login menu__inner__item--mobile">
                <div class="login__item">
                  <div class="login__item__btn login__item--google">Google</div>
                </div>
                <div class="login__item">
                  <div class="login__item__btn login__item--fb">Facebook</div>
                </div>
              </div>
              <div class="menu__inner__item">
                <a href="/cart"><img class="menu__inner__item__img" src="/images/cart-outline.svg" alt="mycart"/></a>
                <a href="/cart"><span class="menu__inner__item__text">My cart</span></a>
              </div>
              <div class="menu__inner__item">
                <img class="menu__inner__item__img" src="/images/person-outline.svg" alt="mypage"/>
                <span class="menu__inner__item__text">My page</span>
              </div>
              <div class="menu__inner__item">
                <img class="menu__inner__item__img" src="/images/wallet-outline.svg" alt="mywallet"/>
                <span class="menu__inner__item__text">My wallet</span>
              </div>
              <div class="menu__inner__item menu__inner__item--mobile">Help Center</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="header__bottom__wrapper">
        <div class="header__bottom__menu">
          <div>
            <a>Home</a>
          </div>
          <div>
            <a>Categories</a>
          </div>
          <div>
            <a>Products</a>
          </div>
        </div>
      </div>
    </div>
  </header>`;
};

const render = (user) => {
  return user ? privateHeader(user) : publicHeader();
};

module.exports = {
  render,
};
