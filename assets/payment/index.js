const { _, $ } = window;
const { L } = _;

const checkImg = (str) => /\.jpg$/.test(str);

const tmplProductOption = _.ifElse(
    checkImg,
    (option) => `<div class="item-option"></div>`,
    (option) => `<div class="item-option"><span>${option}</span></div>`
  )

const parseCartOptions = (cartOptions) => _.go(
    cartOptions,
    _.split("%"),
    _.map(option => option.split("@")),
    _.flat,
  );

const tmpl = (payments) => `
  <div class="payment-item-wrapper">
    ${_.strMap(p => `
      <div class="payment__item">
        <div class="payment__item__products">
          <div class="payment__item__products__top">
            <div class="payment__item__products__top__title">상품내역</div>
            <div class="payment__item__products__top__amount">(total : ${p.amount})</div>  
          </div>
          <div class="product__card-container">
            ${p._.products.length === 0 ? '오류' : _.strMap(prod => {
              const { productUrl, productName, productPrice, productThumbnail, productOptions, count } = prod;
              const options = parseCartOptions(productOptions);
              const img = _.go(
                options,
                _.filter(checkImg),
                _.head
              )
              return `
              <div class="product__card">
                <div class="product__card__header">
                  <img alt="thumbnail" src=${img ? img : productThumbnail} />
                </div>
                <div class="product__card__body">
                  <div class="product__card__body__title">${productName}</div>
                  <div class="product__card__body__price">가격 : ${productPrice}</div>
                  <div class="product__card__body__options">
                    ${_.strMap(_.join(""), _.go(options, _.map(tmplProductOption)))}
                  </div>
                </div>
              </div>`}, p._.products)}
          </div>
        </div>
        <div class="payment__item__shipping">
          <p>배송비 가격 : ${p.shippingfee === null ? '책정중' : p.shippingfee}</p>
          <p>배송비 결제 상태 : ${p.state}</p>
        </div>
      </div>
    `, payments)}
  </div>
  `;

(async function(){ 
  _.go(
    $.get('/api/payment/', {}),
    _.tap(_.log),
    ({ payments }) => payments,
    tmpl,
    $.el,
    $.appendTo($.qs('.payment')),
  )
})();