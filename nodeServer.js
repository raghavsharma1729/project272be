require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const modules = require("./modules");
const handler = require("./apiHandler");
const { schema, validate } = require("./apiSchema");

let callAndWait = () => {
  console.log("Kafka client has not connected yet, message will be lost");
};

callAndWait = async (fn, ...params) => modules[fn](...params);

const err = (msg) => ({ err: msg });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

const apiVersion = "/apiV1";

[
  ["post", "/message", handler.common.postMessage, null],
  ["get", "/message/:orderId", handler.common.getMessages, null],
  ["get", "/location", handler.driver.getLocation, null],
  ["get", "/currentUser", handler.common.currentUser, null],
  [
    "post",
    "/signup/seller",
    handler.common.signupSeller,
    null,
    schema.signupSeller,
  ],
  // list customers (direct query)
  ["get", "/list/customers", handler.customer.list, null, null],
  // create item for retail_shop dashboard
  [
    "post",
    "/signup/customer",
    handler.common.signupCustomer,
    null,
    schema.signupCustomer,
  ],
  [
    "post",
    "/signup/driver",
    handler.common.signupDriver,
    null,
    schema.signupDriver,
  ],
  [
    "put",
    "/login/seller",
    handler.common.loginSeller,
    null,
    schema.loginSeller,
  ],
  [
    "put",
    "/login/customer",
    handler.common.loginCustomer,
    null,
    schema.loginCustomer,
  ],
  [
    "put",
    "/login/driver",
    handler.common.loginDriver,
    null,
    schema.loginDriver,
  ],
  // ["put", "/login/admin", handler.common.loginAdmin, null, schema.loginAdmin],
  ["put", "/seller", handler.seller.update, "seller", schema.updateSeller],
  ["put", "/driver", handler.driver.update, "driver", schema.updateDriver],
  ["post", "/file", handler.common.uploadFile, null],
  ["get", "/file/:id", handler.common.getFile, null],
  [
    "post",
    "/item",
    handler.seller.addItem,
    "seller",
    schema.addItem,
  ],
  ["get", "/item", handler.seller.getItem, "seller"],
  [
    "get",
    "/seller/:id/item",
    handler.seller.getItemBySellerId,
    "admin",
  ],
  ["put", "/customer", handler.customer.update, "customer", schema.update],
  // ["get", "/search/seller", handler.customer.searchSeller, "any"],
  ["get", "/search/item", handler.customer.searchItem, "customer"],
  ["get", "/seller/profile/:id", handler.customer.getSeller, "any"],
  ["get", "/customer/profile/:id", handler.seller.getCustomer, "any"],
  // api for customer to list products for a shop
  ["get", "/item/:id", handler.customer.getItem, "customer"],
  [
    "put",
    "/order/:id",
    handler.customer.putOrder,
    "customer",
    schema.putOrder,
  ],
  ["delete", "/order/:id", handler.customer.withdrawOrder, "customer"],
  [
    "get",
    "/seller/orders",
    handler.seller.orders,
    "seller",
  ],
  ["get", "/driver/orders", handler.driver.getOrders, "driver"],
  ["put", "/assignDriver/:id", handler.seller.assignDriver, "driver"],
  ["put", "/orders/location/:id", handler.driver.locationUpdate, "driver"],
  [
    "get",
    "/customer/orders",
    handler.customer.orders,
    "customer",
  ],
  [
    "put",
    "/seller/order/status/:id",
    handler.seller.setOrderStatus,
    "any",
  ],
  //not required
  [
    "get",
    "/item/seller/:id",
    handler.customer.getSellerItems,
    "customer",
  ],
  //not required
  // ["post", "/sellerPhoto/:id", handler.customer.addSellerPhoto, "customer"],
  //not required
  // ["get", "/sellerPhoto/:id", handler.customer.getSellerPhotos, "any"],
  //not required
  ["get", "/seller/report", handler.seller.getSellerReport, "seller"],
  //not required
  [
    "get",
    "/seller/:id/report",
    handler.seller.getSellerReportBySellerId,
    "admin",
  ]
].forEach((r) => {
  app[r[0]](
    apiVersion + r[1],
    (req, resp, next) => {
      const token = req.header("authorization");
      req.session = {};
      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
          resp
            .status(401)
            .json(err("You need to login, your session has expired"));
        }
        req.session = jwt.decode(token);
      }

      console.log(r[0], r[1]);
      // console.log(r[3]);
      if (r[3] === "seller" || r[3] === "customer" || r[3] === "admin") {
        const { scope } = req.session;
        if (scope !== r[3]) {
          resp.status(401).json(err("You are not authorized for this action."));
        }
      }
      if (r[3] === "any") {
        const { scope } = req.session;
        if (!scope) {
          resp.status(401).json(err("You need to login."));
        }
      }
      if (r[4]) {
        const { error } = validate(req.body, r[4]);
        if (error) {
          const messages = error.details.map((d) => d.message);
          resp.status(400).json(err(messages[0]));
        } else {
          req.requestKafka = callAndWait;
          next();
        }
      } else {
        req.requestKafka = callAndWait;
        next();
      }
    },
    async (req, res, next) => {
      try {
        await r[2](req, res, next);
      } catch (e) {
        next(e);
      }
    }
  );
});

// Handle errors
app.use((err, req, res, next) => {
  console.log(err);
  if (err) {
    const { message } = err;
    res.status(500).json({ err: "Something went wrong!", message });
  }
  next();
});

app.listen(parseInt(process.env.PORT));
module.exports = app; // used by mocha tests
