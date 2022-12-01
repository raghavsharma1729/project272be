const { RetailOrder, Employee, RetailShop } = require("../../mongodb");

module.exports = {
  createOrder: async (req, resp) => {
    const customer = req.session.user._id;
    const retailShop = req.params.shopId;
    if (!customer) {
      resp.json({ message: "invalid request sender" });
    } else {
      const retailOrder = new RetailOrder({
        ...req.body,
        customer,
        retailShop,
      });
      await Employee.update(
        { _id: customer },
        { $push: { retailOrders: retailOrder } }
      );
      await RetailShop.update(
        { _id: retailShop },
        { $push: { retailOrders: retailOrder } }
      );
      await retailOrder.save();
      resp.json(retailOrder);
    }
  },
  customerOrders: async (req, res) => {
    const customer = req.session.user._id;
    const orders = await RetailOrder.find({ customer })
      .populate("orderItems")
      .populate("retailShop")
      .populate("shopper");
    res.json(orders);
  },
  list: async (req, res) => {
    const retailOrders = await RetailOrder.find();
    res.json(shops);
  },
};
