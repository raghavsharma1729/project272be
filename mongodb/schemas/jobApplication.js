module.exports = (mongoose) => {
  const jobApplicationSchema = new mongoose.Schema(
    {
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPosting",
        required: true,
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
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

  return mongoose.model("JobApplication", jobApplicationSchema);
};
