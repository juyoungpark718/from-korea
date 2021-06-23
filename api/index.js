const cartRouter = require("./cart");
const paymentRouter = require("./payment");

app.use("/api/cart", cartRouter);
// app.use("/api/payment", paymentRouter);