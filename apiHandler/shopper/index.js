const { Shopper, RetailOrder } = require("../../mongodb");

module.exports = {
  list: async (req, res) => {
    const shoppers = await Shopper.find();
    res.json(shoppers);
  },
  orders: async (req, res) => {
    const shopper = await Shopper.findById(req.session.user._id).populate({
      path: "retailOrders",
      populate: [{ path: "retailShop" }, { path: "customer" }],
    });
    res.json(shopper.retailOrders);
  },
  assignDriver: async (req, res) => {
    const retailOrder = await RetailOrder.findById(req.params.id);
  },
};
