const { _, $ } = window;

const menuBtn = $.qs(".header__user img");

$.on("click", (e) => _.log(e))(menuBtn);
_.go(
  menuBtn,
  $.on("click", (e) => {
    const menu = $.qs(".header__user .menu");
    $.toggleClass("menu--show", menu);
  })
);

_.go(
  $.qs(".menu .menu__inner__x-btn"),
  $.on("click", (e) => {
    const menu = $.qs(".header__user .menu");
    $.toggleClass("menu--show", menu);
  })
);

// image slider
function imageSlider(){
  const items = [...$.qsa(".slider__item")];
  const dotsHTML = _.go(
    _.range(3),
    _.map(() => '<div class="slider-controller__dot"></div>'),
    (arr) => arr.join("")
  );
  const dots = _.go(
    $.qs(".slider-controller"),
    $.setHTML(dotsHTML),
    (sliderController) => [...$.qsa(".slider-controller__dot", sliderController)],
  );
  let slideRAF = null;
  let currentItemIndex = 0;

  $.toggleClass("slider-controller__dot--active", dots[currentItemIndex]);
  items[currentItemIndex].style.display = "block";

  function getNextItemIndex(len, next){
    if(0 > next) return len-1;
    if(next >= len) return 0;
    return next;
  }
  
  function slide(value){
    let start = 0;
    let nextItemIndex = getNextItemIndex(items.length, currentItemIndex+value);
    let current = items[currentItemIndex];
    let next = items[nextItemIndex];

    $.toggleClass("slider-controller__dot--active", dots[currentItemIndex]);
    $.toggleClass("slider-controller__dot--active", dots[nextItemIndex]);

    if(value > 0) next.style.left = "100%";
    else next.style.right = "100%";

    next.style.display = "flex";
    
    function slideAnimation(timestamp) {
      if(!start) start = timestamp;
      let progress = timestamp - start;
      if(value > 0){
        current.style.right = Math.min(progress / 5, 100) + "%";
        next.style.left = (100 - Math.min(progress / 5, 100)) + "%";
      }else{
        current.style.left = Math.min(progress/ 5, 100) + "%";
        next.style.right = (100 - Math.min(progress/ 5, 100)) + "%";
      }
      if(progress < 1000){
        window.requestAnimationFrame(slideAnimation);
      }else{
        currentItemIndex = nextItemIndex
        current.style.display = "none";
        current.style.left = "auto";
        current.style.right = "auto";
        next.style.left = "auto";
        next.style.right = "auto";
        slideRAF = null;
      }
    }
  
    slideRAF = window.requestAnimationFrame(slideAnimation);
  }
  
  $.qs(".btn-left").addEventListener("click", () => {
    if(!slideRAF) slide(-1);
  });
  
  $.qs(".btn-right").addEventListener("click", () => {
    if(!slideRAF) slide(1);
  });
  
  setInterval(() => {
    if(!slideRAF) slide(1)
  }, 5000);
}

imageSlider();