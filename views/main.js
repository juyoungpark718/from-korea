const googleLogin = () => {
  const query = [
    "response_type=code&",
    `client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&`,
    "scope=openid%20profile%20email&",
    "redirect_uri=http%3a%2f%2flocalhost%3a3000%2foauth%2fgoogle%2fredirect&",
    // "state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2-login-demo.example.com%2FmyHome&0394852-3190485-2490358&",
  ]
  return `<a href="https://accounts.google.com/o/oauth2/v2/auth?${query.join("")}">구글 로그인</a>`
}

const fbLogin = () => {
  const query = [
    `client_id=${process.env.FB_OAUTH_CLIENT_ID}&`,
    `redirect_uri=http%3a%2f%2flocalhost%3a3000%2foauth%2ffacebook%2fredirect&`,
    `state=aewfap21j21fjiweofjaoj3foij3joij3afj&`,
    `granted_scopes=email`
  ]
  return `<a href="https://www.facebook.com/v10.0/dialog/oauth?${query.join("")}">페이스북 로그인</a>`
}

const render = () => `
  <div class="container">
    <div class="main">
      <div class="slider">
        <div>여기는 사진 슬라이딩</div>
      </div>
      <div class="order-manual">
        <div>여기는 주문 방법</div>
      </div>
      <div class="product">
        <div class="product__inner">
          <div class="card">
            <div class="card__header">
              <img src="https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2020/08/21/16/6/c9dadafc-38cb-4389-a9fd-ec6b40aad16f.jpg"/>
            </div>
            <div class="card__title">
              에뛰드 플레이 컬러 아이즈 뮬리로맨스 아이섀도 팔레트 8g
            </div>
            <div class="card__detail">
              <div class="card__detail__price">14,410원</div>
              <div class="card_detail__sold">1004 Sold</div>
            </div>
          </div>
          <div class="card">
            <div class="card__header">
              <img src="https://thumbnail6.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2020/08/21/16/6/c9dadafc-38cb-4389-a9fd-ec6b40aad16f.jpg"/>
            </div>
            <div class="card__title">
              에뛰드 플레이 컬러 아이즈 뮬리로맨스 아이섀도 팔레트 8g
            </div>
            <div class="card__detail">
              <div class="card__detail__price">14,410원</div>
              <div class="card_detail__sold">1004 Sold</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

module.exports = {
  render,
}