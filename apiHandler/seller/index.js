const { Seller, Item, Order, Customer, Review, Driver, RetailOrder } = require('../../mongodb');
const { err, sendEmail } = require('../util');
const kModules = require('../../modules');

module.exports = {
  update: async (req, resp) => {
    const seller = await Seller.findById(req.session.user._id);
    Object.assign(seller, req.body);
    resp.json(await seller.save());
  },
  addItem: async (req, res) => {
    const sellerId = req.session.user._id;
    res.json(await kModules.addItem(sellerId, req.body));
  },
  getItem: async (req, res) => {
    const sellerId = req.session.user._id;
    res.json(await Item
      .find({ seller: sellerId })
      .sort({ createdAt: -1 }));
  },
  getItemBySellerId: async (req, res) => {
    const sellerId = req.params.id;
    res.json(await Item
      .find({ seller: sellerId })
      .sort({ createdAt: -1 }))
  },

  assignDriver: async (req, res) => {
    const driver = await Driver.findOne({ availabilityStatus: "available" });
    if (!driver)
      res.status(400).json(err("No available drivers"));
    const order = await Order.findById(req.params.id);
    order.driver = driver.id;
    driver.availabilityStatus = "busy";
    await driver.save();
    res.json(await order.save());
  },
  orders: async (req, res) => {
    const sellerId = req.session.user._id;
    res.json(await Order.find({ seller: sellerId })
      .populate('item')
      .populate('customer').populate('driver'));
  },
  getCustomer: async (req, res) => {
    const { id: customerId } = req.params;
    res.json(await Customer.findById(customerId));
  },
  setOrderStatus: async (req, res) => {
    const sellerId = req.session.user._id;
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('customer');
    const { status } = req.body;
    order.status = status;
    if (order.status === 'Delivered' && order.driver) {
      const driver = await Driver.findById(order.driver);
      driver.availabilityStatus = 'available';
      await driver.save();
    }
    sendEmail(order.customer.email, 'Your order with id ' + orderId + ' has been updated with following status ' + status);
    res.json(await order.save());

  },
  getSellerReport: async (req, res) => {
    const sellerId = req.session.user._id;
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    // Job posting in the last year
    const item = await Item.find({ seller: sellerId, createdAt: { $gt: d } });
    const itemIds = item.map((j) => j._id);
    res.json(await Order.find({ item: itemIds })
      .populate('customer')
      .populate('item'));
  },
  getSellerReportBySellerId: async (req, res) => {
    const sellerId = req.params.id;
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    // Job posting in the last year
    const item = await Item.find({ seller: sellerId, createdAt: { $gt: d } });
    const itemIds = item.map((j) => j._id);
    res.json(await Order.find({ item: itemIds })
      .populate('customer')
      .populate('item'));
  }
};
