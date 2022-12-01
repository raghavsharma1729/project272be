module.exports = (mongoose) => {
  const companySchema = new mongoose.Schema({
    name: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    description: { type: String },
    size: { type: Number },
    type: { type: String },
    revenue: { type: String },
    headquarters: { type: String },
    founded: { type: String },
    website: { type: String },
    mission: { type: String },
    profilePic: { type: String },
    jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true }],
    favoriteReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    featuredReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
      },
    },
  });

  return mongoose.model('Company', companySchema);
};
