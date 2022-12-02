const {
  Customer,
  Driver,
  Item,
  Order,
  DriverLocation,
} = require("../../mongodb");
const mongoose = require("mongoose");

const kModules = require("../../modules");
const { driver } = require("mongoose");

module.exports = {
  locationUpdate: async (req, res) => {
    const orderLocation = await DriverLocation.find({ orderId: req.params.id });

    if (orderLocation.length === 0) {
      const driverLocation = new DriverLocation({
        orderId: req.params.id,
        location: [req.body],
      });
      return res.json(await driverLocation.save());
    } else {
      const driverLocation = orderLocation[0];
      newLocations = driverLocation.location;
      newLocations.push(req.body);
      driverLocation.location = newLocations;
      res.json(await driverLocation.save());
    }
  },

  getLocation: async (req, res) => {
    const locations = await DriverLocation.find().limit(1);
    res.json(locations[0]);
  },
  update: async (req, resp) => {
    const driver = await Driver.findById(req.session.user._id);
    Object.assign(driver, req.body);
    const dri = await driver.save();
    resp.json(dri);
  },
  getOrders: async (req, res) => {
    const driverId = req.session.user._id;
    res.json(
      await Order.find({ driver: driverId })
        .populate("item")
        .populate("customer")
        .populate("driver")
    );
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
    res.json(await order.save());
  },
  getSellerItem: async (req, res) => {
    const sellerId = req.params.id;
    res.json(await kModules.getSellerItem(sellerId));
  }
};
