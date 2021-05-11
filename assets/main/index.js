const { _, $ } = window;

const menuBtn = $.qs(".header__user img");

$.on("click", (e) => _.log(e))(menuBtn);
_.go(
  menuBtn,
  $.on("click", e => {
    const menu = $.qs(".header__user .menu");
    $.toggleClass("menu--show", menu)
  })
)

_.go(
  $.qs(".menu .menu__inner__x-btn"),
  $.on("click", e => {
    const menu = $.qs(".header__user .menu");
    $.toggleClass("menu--show", menu)
  })
)