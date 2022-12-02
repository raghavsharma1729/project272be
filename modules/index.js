const {
  Seller, Item
} = require('../mongodb');

module.exports = {
  addItem: async (sellerId, itemDetail) => {
    const item = new Item({ ...itemDetail, seller: sellerId });
    const newItem = await item.save();
    const seller = await Seller.findById(sellerId);
    seller.items.push(newItem._id);
    return seller.save();
  },
  getSellerItem: async (sellerID) => {
    const items = await Item.find({ seller: sellerID });
    return items.map((j) => {
      return { ...j.toJSON() };
    });
  }
};
