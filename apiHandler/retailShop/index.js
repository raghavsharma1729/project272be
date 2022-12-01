const { RetailShop, Shopper, RetailOrder } = require("../../mongodb");

module.exports = {
  update: async (req, resp) => {
    const retailShop = await RetailShop.findById(req.session.user._id);
    Object.assign(retailShop, req.body);
    resp.json(await retailShop.save());
  },
  list: async (req, res) => {
    const shops = await RetailShop.find().populate("retailItems");
    res.json(shops);
  },
  listItems: async (req, res) => {
    const retailShopItems = await RetailShop.findById(req.params.id).populate(
      "retailItems"
    );
    res.json(retailShopItems.retailItems);
  },
  orders: async (req, res) => {
    const retailShop = await RetailShop.findById(req.session.user._id).populate(
      {
        path: "retailOrders",
        populate: [
          { path: "retailShop" },
          { path: "orderItems" },
          { path: "shopper" },
          { path: "customer" },
        ],
      }
    );
    res.json(retailShop.retailOrders);
  },
  assignShopper: async (req, res) => {
    const retailShop = await RetailShop.findById(req.session.user._id);
    const shopper = await Shopper.find({ retailShop: retailShop._id })
      .sort({ ordersLength: -1 })
      .limit(1);
    if (!shopper) res.status(400).json(err("No available shoppers"));
    const retailOrder = await RetailOrder.findById(req.params.retailOrderId);
    retailOrder.shopper = shopper[0].id;
    retailOrder.status = "shopping_in_progress";
    await retailOrder.save();
    const shopperFound = await Shopper.findByIdAndUpdate(
      shopper[0],
      // { _id: shopper[0] },
      { $push: { retailOrders: retailOrder }, $inc: { ordersLength: 1 } }
    );
    console.log(shopperFound);
    res.json(shopperFound);
  },
};
