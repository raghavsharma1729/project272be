//Not in use

module.exports = (mongoose) => {
  const interviewExperienceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    difficulty: { type: String, required: true },
    offerStatus: { type: String, required: true },
    questions: { type: String },
    answers: { type: String },
    overallExperience: { type: String, required: true },
  },
  {
    timestamps: true,
  });
  return mongoose.model('InterviewExperience', interviewExperienceSchema);
};
