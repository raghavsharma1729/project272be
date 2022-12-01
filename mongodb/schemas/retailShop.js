module.exports = (mongoose) => {
  const retailShopSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, index: { unique: true } },
      email: { type: String, required: true, index: { unique: true } },
      password: { type: String, required: true },
      description: { type: String },
      profilePic: { type: String },
      retailItems: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RetailItem",
        },
      ],
      retailOrders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RetailOrder",
        },
      ],
      shoppers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shopper",
        },
      ],
    },
    {
      timestamps: true,
      toJSON: {
        transform: (doc, ret) => {
          delete ret.password;
        },
      },
    }
  );

  return mongoose.model("RetailShop", retailShopSchema);
};
