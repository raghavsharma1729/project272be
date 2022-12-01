module.exports = (mongoose) => {
  const jobPostingSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    industry: { type: String },
    country: { type: String },
    inPerson: { type: Boolean, default: true },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    time: {type: Number},
    distance: {type: Number},
  },
  {
    timestamps: true,
  });

  return mongoose.model('JobPosting', jobPostingSchema);
};
