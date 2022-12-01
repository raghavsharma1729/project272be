//Not in use

module.exports = (mongoose) => {
  const companySalarySchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
    baseSalary: { type: Number, required: true },
    bonus: { type: Number, required: true },
    yearsOfExperience: { type: Number, required: true },
    location: { type: String },
  },
  {
    timestamps: true,
  });

  return mongoose.model('CompanySalary', companySalarySchema);
};
