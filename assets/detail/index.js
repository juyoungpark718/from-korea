const { _, $ } = window;

function addCart(event){
  const urlQuery = new URLSearchParams(window.location.search);
  const cartData = _.go(
    $.qs(".product__form"),
    (form) => form ? form.elements : [],
    _.filter(el => el.tagName === "INPUT"),
    (inputs) => _.reduce((obj, input) => {
      const { name, value, type, checked } = input;
      if(type === 'radio' && checked === false) return obj;
      obj[name] = value;
      return obj;
    }, {}, inputs),
  );
  if(!urlQuery.has("url")) return;
  cartData.productUrl = urlQuery.get("url");
  _.go(
    cartData,
    $.post("/api/cart"),
    _.log
  );
}

_.go(
  $.qs(".add-cart"),
  $.on("click", addCart)
)