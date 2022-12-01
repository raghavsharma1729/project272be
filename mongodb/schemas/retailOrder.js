module.exports = (mongoose) => {
  const retailOrderSchema = new mongoose.Schema(
    {
      retailShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RetailShop",
        required: true,
      },
      customer: {
        // employee is customer
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "RetailItem" }],
      status: {
        type: String,
        enum: [
          "shopping_order_received",
          "shopping_in_progress",
          "shopping_complete",
          "order_checked_out",
          "start_driver_handover",
          "driver_handover_complete",
        ],
        default: "shopping_order_received",
      },
      shopper: { type: mongoose.Schema.Types.ObjectId, ref: "Shopper" },
      driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model("RetailOrder", retailOrderSchema);
};
