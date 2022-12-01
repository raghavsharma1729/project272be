module.exports = (mongoose) => {
    const locationSchema = new mongoose.Schema({
      location: [{ lat: Number, lon: Number} ], 
      orderId:{ type: String, required: true },
    },
    {
      timestamps: true,
    });
  
    return mongoose.model('locations', locationSchema);
  };
  