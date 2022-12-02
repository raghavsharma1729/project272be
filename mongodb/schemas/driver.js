module.exports = (mongoose) => {
  const driverSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, index: { unique: true } },
      password: { type: String, required: true },
      availabilityStatus: {
        type: String,
        enum: ["available", "busy"],
        default: "available",
      },
      isMale: { type: Boolean, default: true },
      profilePic: { type: String },
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
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

  return mongoose.model("Driver", driverSchema);
};
