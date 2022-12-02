const mongoose = require("mongoose");

console.log("Using mongo connection string", process.env.MONGODB_CONNECTION);

mongoose.connect(process.env.MONGODB_CONNECTION, {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("error", () => {
  console.log("Mongo error");
});
mongoose.connection.once("open", () => {
  console.log("Connected to mongo");
});

// Import and re-export models here

const Seller = require("./schemas/seller")(mongoose);
const Customer = require("./schemas/customer")(mongoose);
const Driver = require("./schemas/driver")(mongoose);
const Item = require("./schemas/item")(mongoose);
const Order = require("./schemas/orders")(mongoose);
const DriverLocation = require("./schemas/location")(mongoose);
const Messages = require("./schemas/messages")(mongoose);

module.exports = {
  Seller,
  Customer,
  Driver,
  Item,
  Order,
  DriverLocation,
  Messages
};
