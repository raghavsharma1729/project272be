module.exports = (mongoose) => {
    const messageSchema = mongoose.Schema(
        {
          orderId: String,
          messages: [Object],  },
        { timestamps: true }
      );
  
    return  mongoose.model("Message", messageSchema);
  };