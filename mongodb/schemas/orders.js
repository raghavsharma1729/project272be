module.exports = (mongoose) => {
  const orderSchema = new mongoose.Schema(
    {
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      status: {
        type: String,
        enum: [
          "Order placed",
          "Picked Up",
          "Packing",
          "Out for delivery",
          "Delivered",
          "Cancelled",
        ],
        default: "Order placed",
      },
      driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model("Order", orderSchema);
};
