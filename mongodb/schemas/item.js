module.exports = (mongoose) => {
  const ItemSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    title: { type: String, required: true },
    price: { type: String },
    description: { type: String },
    brand: { type: String },
    condition: { type: String },
    purchasedDate: { type: Date },
    status: {
      type: String,
      enum: [
        "sold",
        "available"
      ],
      default: "available"
    },
    picture: { type: String }
  },
    {
      timestamps: true,
    });

  return mongoose.model('Item', ItemSchema);
};
