const {
  Company, JobPosting, CompanySalary, Review,
} = require('../mongodb');

module.exports = {
  addJobPosting: async (companyId, posting) => {
    const jobPosting = new JobPosting({ ...posting, company: companyId });
    const newJobPosting = await jobPosting.save();
    const company = await Company.findById(companyId);
    company.jobPostings.push(newJobPosting._id);
    return company.save();
  },
  getCompanyJobPosting: async (companyId) => {
    const jobPostings = await JobPosting.find({ company: companyId });
    const companySalaries = await CompanySalary.aggregate([
      { $group: { _id: '$jobPosting', minBaseSalary: { $min: '$baseSalary' }, maxBaseSalary: { $max: '$baseSalary' } } },
    ]);

    const keyByJobPostingId = companySalaries
      .reduce((m, s) => ({ ...m, [s._id]: s }), {});

    return jobPostings.map((j) => {
      const { minBaseSalary, maxBaseSalary } = keyByJobPostingId[j._id]
      || { minBaseSalary: null, maxBaseSalary: null };
      return { ...j.toJSON(), minBaseSalary, maxBaseSalary };
    });
  },
  addReview: async (newReview) => {
    const review = new Review(newReview);
    const savedReview = await review.save();
    return savedReview;
  },
  getDummyReviews: async (companyId, limit) =>
    // With redis
    // const key = `getDummyReviews${companyId}${limit}`;
    // if (await redisGet(key) === null) {
    //   await redisSet(key, await Review.find({ company: companyId }).limit(limit));
    // }
    // return redisGet(key);
    Review.find({ company: companyId }).limit(limit)
  ,
};
