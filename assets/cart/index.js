const { _, $ } = window;
const { L } = _;

const checkImg = (str) => /\.jpg$/.test(str);

const tmplProductOption = _.ifElse(
    checkImg,
    (option) => `<div class="item-option"><img src=${option} alt="product-img"/></div>`,
    (option) => `<div class="item-option"><span>${option}</span></div>`
  )

const parseCartOptions = (cartOptions) => _.go(
    cartOptions,
    _.split("%"),
    _.map(option => option.split("@")),
    _.flat,
  );

function tmplCartItem(cart){
  const { id, productUrl, productId, productName, productPrice, productThumbnail, productOptions, count } = cart;
  const options = parseCartOptions(productOptions);
  const img = _.go(
    options,
    _.filter(checkImg),
    _.head
  )
  return `
    <div class="cart__item">
      <label class="cart__item__col cart__item__checkbox">
        <input class="product-checkbox" type="checkbox" value='${id}' />
      </label>
      <div class="cart__item__col cart__item__img">
        <img src="${img ? img : productThumbnail}" alt="${productName}"/>
      </div>
      <div class="cart__item__col cart__item__name">${productName}</div>
      <div class="cart__item__col cart__item__price">${+productPrice * +count}</div>
      <div class="cart__item__col cart__item__options"> 
        ${_.strMap(_.join(""), _.go(options, _.map(tmplProductOption)))}
      </div>
      <div class="cart__item__col cart__item__count">
        <select class="item-count" data-id=${id} value='${count}'>
          ${_.go(
            _.range(5),
            _.map(i => `<option ${Number(count) === i+1 ? 'selected' : ''} value=${i+1}>${i+1}</option>`),
            _.join('')
          )}
        </select>
      </div>
    </div>`;
}

const createOrder = indexedCarts => (data, actions) => {
  const totalPrice = _.go(
    $.qsa(".product-checkbox"),
    L.filter(e => e.checked),
    L.map(e => e.value),
    L.map(e => indexedCarts[e]),
    L.map(cart => cart.productPrice * cart.count),
    prices => _.reduce((a,b) => a+b, 0, prices),
  );
  console.log(totalPrice);
  return fetch('/api/payment/paypal/order/create', {
      method: 'post',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        intent: 'CAPTURE',
        purchase_units:[
          {
            amount: {
                value: `${totalPrice / 1000}`,
                currency_code: 'USD'
            }
        }]
      })
  }).then(function(res) {
      return res.json();
  }).then(function(orderData) {
      return orderData.id;
  });
};

function onApprove(data, actions) {
  const { facilitatorAccessToken, orderID, payerID } = data;
  return $.post(`/api/payment/paypal/order/${orderID}/capture/`, {
    facilitatorAccessToken:facilitatorAccessToken,
    orderID:orderID,
    payerID:payerID
  }).then(function(orderData) {
    console.log(orderData);
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you

      // This example reads a v2/checkout/orders capture response, propagated from the server
      // You could use a different API or structure for your 'orderData'
      const errorDetail = Array.isArray(orderData.details) && orderData.details[0];

      if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
          return actions.restart(); // Recoverable state, per:
          // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
      }

      if (errorDetail) {
          let msg = 'Sorry, your transaction could not be processed.';
          if (errorDetail.description) msg += '\n\n' + errorDetail.description;
          if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
          return alert(msg); // Show a failure message
      }

      // Show a success message
      alert('Transaction completed by ' + orderData.payer.name.given_name);
  });
}

const UI = {};

UI.paypalModal = (indexedCarts) => (e) => {
  const checked = _.go(
    $.qsa(".product-checkbox"),
    _.filter(e => e.checked),
  );
  if(checked.length === 0) return;
  const totalPrice = _.go(
    checked,
    L.map(e => e.value),
    L.map(e => indexedCarts[e]),
    L.map(cart => cart.productPrice * cart.count),
    prices => _.reduce((a,b) => a+b, 0, prices),
  );

  _.go(
    `<div class="modal-container">
      <div class="modal-bg close-modal"></div>
      <div class="modal">
        <div class="modal-controller">
          <div class="x-btn close-modal">X</div>
        </div>
        <div>
          <h1>총 가격</h1>
          <h2>${totalPrice}</h2>
        </div>
        <div class="paypal-button-container">
          <div id="paypal-button-wrapper"></div>
        </div>
      </div>
    <div>`,
    $.el,
    $.appendTo($.qs('.cart-container')),
    _.tap(
      $.findAll(".close-modal"),
      _.map($.on("click", ({ currentTarget }) => _.go(
          currentTarget,
          $.closest('.modal-container'),
          $.remove
        ))
      )
    ),
    () => paypal.Buttons({
      // Call your server to set up the transaction
      createOrder: createOrder(indexedCarts),
      // Call your server to finalize the transaction
      onApprove,
    }).render('#paypal-button-wrapper')
  );
}

// -------------------------------------------

(async function(){
  const wrapper = $.qs('.cart__item-wrapper');
  const totalEl = $.el(`
   <div class="cart__price-wrapper">
    <div class="cart__price">
      <h2>총 금액</h2>
      <h1 class="total-price">0</h1>
    </div>
    <div class="">
      <button class="open-modal">결제하기</button>
    </div>
   </div>`);

  const price = $.find(".total-price", totalEl);
  try{
    wrapper.innerHTML = '<div><h2>데이터를 불러오는 중입니다.</h2></div>'
    const { carts, csrf } = await $.get('/api/cart/', {});
    const indexedCarts = _.indexBy(cart => cart.id, carts);
    _.go(
      totalEl,
      $.find(".open-modal"),
      $.on("click", UI.paypalModal(indexedCarts)),
    );
    const head = `
    <div class="cart__item">
      <div class="cart__item__col cart__item__checkbox cart__item__head">checkbox</div>
      <div class="cart__item__col cart__item__img cart__item__head">Thumbnail</div>
      <div class="cart__item__col cart__item__name cart__item__head">상품 이름</div>
      <div class="cart__item__col cart__item__price cart__item__head">총 가격</div>
      <div class="cart__item__col cart__item__options cart__item__head">상품 옵션</div>
      <div class="cart__item__col cart__item__count cart__item__head">상품 갯수</div>
    </div>`

    _.go(
      wrapper,
      wrapper => (wrapper.innerHTML = head, wrapper),
      _.tap(
        wrapper => _.go(
          carts,
          _.values,
          _.map(tmplCartItem),
          _.join(""),
          html => wrapper.innerHTML += html,
        )
      ),
      wrapper => ($.appendTo(wrapper, totalEl), wrapper),
      $.delegate('change', ".product-checkbox", function(){
        _.go(
          $.findAll(".product-checkbox", wrapper),
          L.filter(e => e.checked),
          L.map(e => e.value),
          L.map(e => indexedCarts[e]),
          L.map(cart => cart.productPrice * cart.count),
          prices => _.reduce((a,b) => a+b, 0, prices),
          total => price.innerText = total,
        )
      }),
      $.delegate('change', ".item-count", function({ currentTarget }){
        const { value } = currentTarget;
        const { id } = currentTarget.dataset;
        _.goS(
          { _csrf:csrf, count: value },
          $.post(`/api/cart/${id}`),
          _.stopIf((res) => !res.ok),
          _ => (indexedCarts[id].count = Number(value)),
        )
      })
    )
  }catch(e){
    wrapper.innerHTML = '<div><h2>데이터 불러오기 실패</h2></div>'
  }
})();