const _ = require("fxjs/Strict");
const L = require("fxjs/Lazy");
const fetch = require("node-fetch");

global.styleSheet = (path) => `<link rel="stylesheet" type="text/css" href="/assets/${path}">`;

global.script = (path) => `<script type="module" src="/assets/${path}"></script>`;

global.hashCode = (str) => _.go(
  str,
  _.split(''),
  strArr => _.reduce((a,b) => {
    let code = b.charCodeAt(0);
    a = (a << 6&268435455) + code + (code << 14);
    let c = a & 266338304;
    return c !==0 ? a^c >> 21 : a;
  }, 0, strArr),
  String
);

global.getCartOptions = (cart) => _.go(
  L.range(Infinity),
  L.map(i => `option${i + 1}`),
  L.map(option => cart[option]),
  _.takeWhile(v => v !== undefined),
  _.join("%")
);