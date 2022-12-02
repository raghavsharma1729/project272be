module.exports = (mongoose) => {
  const customerSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, index: { unique: true } },
      password: { type: String, required: true },
      isMale: { type: Boolean, default: true },
      profilePic: { type: String },
      place: { type: String },
      addressLine: { type: String },
      state: { type: String }
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

  return mongoose.model("Customer", customerSchema);
};
