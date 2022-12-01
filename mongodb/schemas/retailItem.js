module.exports = (mongoose) => {
  const retailItemSchema = new mongoose.Schema(
    {
      retailShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RetailShop",
        required: true,
      },
      title: { type: String, required: true },
      price: { type: String, required: true },
      imageurl: { type: String, required: false },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model("RetailItem", retailItemSchema);
};
