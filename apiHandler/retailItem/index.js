const { RetailItem, RetailShop } = require("../../mongodb");

module.exports = {
  create: async (req, resp) => {
    const retailShop = req.session.user._id;
    if (!retailShop) {
      resp.json({ message: "invalid request sender" });
    } else {
      const retailItem = new RetailItem({ ...req.body, retailShop });
      await RetailShop.update(
        { _id: retailShop },
        { $push: { retailItems: retailItem } }
      );
      resp.json(await retailItem.save());
    }
  },
  list: async (req, res) => {
    const items = await RetailItem.find();
    res.json(items);
  },
};
