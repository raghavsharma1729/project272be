const {
  Customer,
  Item,
  Seller,
  Order,
} = require("../../mongodb");
const kModules = require("../../modules");

module.exports = {
  update: async (req, resp) => {
    const customer = await Customer.findById(req.session.user._id);
    Object.assign(customer, req.body);
    const custmr = await customer.save();
    resp.json(custmr);
  },
  list: async (req, res) => {
    const users = await Customer.find();
    res.json(users);
  },
  searchItem: async (req, res) => {
    const { text } = req.query;
    // TODO Use text index search
    res.json(
      await Item.find({ title: { $regex: text, $options: "i" } })
        .populate("seller")
        .sort({ createdAt: -1 })
    );
  },

  getSeller: async (req, res) => {
    res.json({});
  },
  getItem: async (req, res) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId).populate("seller");
    res.json(item);
  },
  putOrder: async (req, res) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    const customerId = req.session.user._id;
    const order = new Order({
      ...req.body,
      item: itemId,
      customer: customerId,
      seller: item.seller,
      status: "Order placed",
    });
    item.status = 'sold';
    await item.save();
    res.json(await order.save());
  },
  withdrawOrder: async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    const item = await Item.findById(order.item);
    item.status = 'available';
    await item.save();
    res.json(await order.delete());
  },
  orders: async (req, res) => {
    const customerId = req.session.user._id;
    res.json(
      await Order.find({ customer: customerId }).populate({
        path: "item",
        populate: {
          path: "seller",
        },
      })
    );
  },
  getSellerItems: async (req, res) => {
    const sellerId = req.params.id;
    res.json(await kModules.getSellerItem(sellerId));
  }
};
