const _ = require("fxjs/Strict");

function render(csrf){
  return `
  <div class="cart-container">
    <div class="cart">
      <div class="cart__item-wrapper">
      </div>
    </div>
  </div>`
}

module.exports = {
  render
}