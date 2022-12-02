module.exports = (mongoose) => {
  const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    description: { type: String },
    profilePic: { type: String },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
  },
    {
      timestamps: true,
      toJSON: {
        transform: (doc, ret) => {
          delete ret.password;
        },
      },
    });

  return mongoose.model('Seller', sellerSchema);
};
