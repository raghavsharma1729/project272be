const { Number } = require("mongoose");

module.exports = (mongoose) => {
  const shopperSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, index: { unique: true } },
      password: { type: String, required: true },
      retailShop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RetailShop",
        required: true,
      },
      currentStatus: {
        type: String,
        enum: ["not-looking", "casually-looking", "actively-looking", "busy"],
        default: "not-looking",
      },
      profilePic: { type: String },
      primaryResume: { type: String },
      retailOrders: [
        { type: mongoose.Schema.Types.ObjectId, ref: "RetailOrder" },
      ],
      ordersLength: { type: Number, default: 0 },
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

  return mongoose.model("Shopper", shopperSchema);
};
