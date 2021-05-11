const footer = () => {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__top__logo">From. Korea</div>
        <div class="footer__top__desc">
          <h4>From. Korea Description</h4>
          <p>This section is description. write description this section.</p>
        </div>
      </div>
      <div class="footer__middle">
        <div class="footer__middle__row">
          <div class="footer__middle__widget">
            <div class="footer__middle__widget__title">Contact Info</div>
            <div class="footer__middle__widget__content">
              <span>PHONE:</span>Toll Free (123) 456-7890
            </div>
            <div class="footer__middle__widget__content">
              <span>EMAIL:</span>mall@fromkorea.com
            </div>
            <div class="footer__middle__widget__content">
              <span>ADDRESS:</span>123 Street Name, City, Korea
            </div>
            <div class="footer__middle__widget__content">
              <span>WORKING DAYS / HOURS:</span>
            </div>
            <div class="footer__middle__widget__content">
              Mon ~ Fri / 9:00 AM - 6:00 PM 
            </div>
          </div>
          <div class="footer__middle__widget">
            <div class="footer__middle__widget__title">My Account</div>
            <div class="footer__middle__widget__content">
              About Us
            </div>
            <div class="footer__middle__widget__content">
              Order History
            </div>
            <div class="footer__middle__widget__content">
              Returns
            </div>
            <div class="footer__middle__widget__content">
              Custom Service
            </div>
            <div class="footer__middle__widget__content">
              Terms & Condition
            </div>
          </div>
          <div class="footer__middle__widget">
            <div class="footer__middle__widget__title">Contact Info</div>
            <div class="footer__middle__widget__content">
              Sign in
            </div>
            <div class="footer__middle__widget__content">
              View Cart
            </div>
            <div class="footer__middle__widget__content">
              My Wishlist
            </div>
            <div class="footer__middle__widget__content">
              Track My Order
            </div>
            <div class="footer__middle__widget__content">
              Help
            </div>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="footer__bottom__copyright">From. Korea eCommerce © 2021. All Rights Reserved</div>
      </div>
    </div>
  </footer>
  `;
};

const render = () => footer();

module.exports = {
  render,
};
