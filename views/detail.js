const makeOption = (item) => Object.keys(item).map(key => item[key]).join("@");

const render = ({ title, price, itemId, thumbnail, options }, csrf) => `
  <div class="detail-container">
    <div class="detail">
      <div class="product">
        <div class="product__gallery">
          <div class="product__image">
            <img class="image" src=${thumbnail} alt=${title} />
          </div>
        </div>
        <div class="product__details">
          <div class="product__details__title">${title}</div>
          <div class="product__details__price">${price}</div>
          <div class="product__details__options">
            <form class="product__form" method="POST" action="/order/create">
              ${options && options.map((option, i) => {
                const { value } = option;
                if(value.length === 1) return `
                  <div class="product__form__option">
                    <label>
                      <span>옵션${i+1}</span>
                      <input class="input-readonly" type="text" name="option${i+1}" value="${value[0].content}" readonly />
                    </label>
                  </div>
                `;
                return `
                <div class="product__form__option">
                  ${value.map((item, index) => {
                    const { title, content, price, img } = item;
                    return `
                    <div>
                      <label for="option${i+1}-item${index+1}">
                        <input type="radio" id="option${i+1}-item${index+1}" type="radio" name="option${i+1}" value="${makeOption(item)}" ${index === 0 ? 'checked' : ''}/>
                        <div class="product__form__option__desc">
                          ${img ? `<div class="prduct__form__option__desc_img"><img src=${img} alt=""/></div>` : ""}
                          <div class="product__form__option__text">
                            ${title ? `<h3>${title}</h3>` : ""}
                            ${content ? `<h4>${content}</h4>` : ""}
                            ${price ? `<span>${price}</span>` : ""}
                          </div>
                        </div>
                      </label>
                  </div>`
                  }).join("")}
                </div>`
              }).join("")}
              <input type="hidden" name="productId" value="${itemId}" readonly />
              <input type="hidden" name="productName" value="${title}" readonly />
              <input type="hidden" name="productPrice" value="${price}" readonly />
              <input type="hidden" name="productThumbnail" value="${thumbnail}" readonly />
              <input type="hidden" name="_csrf" value="${csrf}" readonly/>
              <input type="number" min="1" max="5" name="count" value="1" />
              <button>구매하기</button>
              <button class="add-cart" type="button">장바구니 추가</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

module.exports = {
  render
}

/*

*/