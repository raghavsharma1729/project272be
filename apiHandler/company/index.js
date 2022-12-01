const { Company, JobPosting, JobApplication, Employee, Review, Driver, RetailOrder } = require('../../mongodb');
const { err, sendEmail } = require('../util');
const kModules = require('../../modules');

module.exports = {
  update: async (req, resp) => {
    const company = await Company.findById(req.session.user._id);
    Object.assign(company, req.body);
    resp.json(await company.save());
  },
  addJobPosting: async (req, res) => {
    const companyId = req.session.user._id;
    res.json(await kModules.addJobPosting(companyId, req.body));
    // Using Kafka
    // res.json(req.requestKafka('addJobPosting', companyId, req.body));
  },
  getJobPosting: async (req, res) => {
    const companyId = req.session.user._id;
    res.json(await JobPosting
      .find({ company: companyId })
      .sort({ createdAt: -1 }));
  },
  getJobPostingByCompanyId: async (req, res) => {
    const companyId = req.params.id;
    res.json(await JobPosting
      .find({ company: companyId })
      .sort({ createdAt: -1 }))
  },

  assignDriver: async (req, res) => {
    const driver = await Driver.findOne({ jobSearchStatus: "not-looking" });
    console.log('----------');
    console.log(driver);
    if (!driver)
      res.status(400).json(err("No available drivers"));

    // const jobApplication = await JobApplication.findById(req.params.id);
    const jobApplication = await RetailOrder.findById(req.params.id);
    console.log('----------');
    console.log(jobApplication);
    jobApplication.driver = driver.id;
    console.log('----------');
    console.log(jobApplication);
    driver.jobSearchStatus = "busy";
    await driver.save();
    res.json(await jobApplication.save());
  },

  jobApplications: async (req, res) => {
    const companyId = req.session.user._id;
    res.json(await JobApplication.find({ company: companyId })
      .populate('job')
      .populate('employee').populate('driver'));
  },
  getEmployee: async (req, res) => {
    const { id: employeeId } = req.params;
    res.json(await Employee.findById(employeeId));
  },
  setJobApplicationStatus: async (req, res) => {
    const companyId = req.session.user._id;
    const jobApplicationId = req.params.id;
    const jobApp = await JobApplication.findById(jobApplicationId).populate('employee');
    const { status } = req.body;
    jobApp.status = status;
    sendEmail(jobApp.employee.email, 'Your order with id ' + jobApplicationId + ' has been updated with following status ' + status);
    res.json(await jobApp.save());

  },
  getCompanyReport: async (req, res) => {
    const companyId = req.session.user._id;
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    // Job posting in the last year
    const jobPosting = await JobPosting.find({ company: companyId, createdAt: { $gt: d } });
    const jobIds = jobPosting.map((j) => j._id);
    res.json(await JobApplication.find({ job: jobIds })
      .populate('employee')
      .populate('job'));
  },
  getCompanyReportByCompanyId: async (req, res) => {
    const companyId = req.params.id;
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    // Job posting in the last year
    const jobPosting = await JobPosting.find({ company: companyId, createdAt: { $gt: d } });
    const jobIds = jobPosting.map((j) => j._id);
    res.json(await JobApplication.find({ job: jobIds })
      .populate('employee')
      .populate('job'));
  },
  getCompanyReviews: async (req, res) => {
    const companyId = req.session.user._id;
    const reviews = await Review.find({
      company: companyId,
    })
      .populate('company', 'name')
      .populate('employee', 'email');
    res.json(reviews);
  },
  markFavorite: async (req, res) => {
    const { reviewId } = req.params;
    const company = await Company.findById(req.session.user._id);
    const review = await Review.findById(reviewId);
    const index = company.favoriteReviews.indexOf(reviewId);
    if (index > -1) {
      review.favorite = false;
      company.favoriteReviews.splice(index, 1);
    } else {
      review.favorite = true;
      company.favoriteReviews.push(reviewId);
    }
    res.json(await company.save() && await review.save());
  },
  updateFeaturedReview: async (req, res) => {
    const { reviewId } = req.params;
    const company = await Company.findById(req.session.user._id);
    if (company.featuredReview) {
      const oldReview = await Review.findById(company.featuredReview);
      oldReview.featured = false;
      await oldReview.save();
    }
    const review = await Review.findById(reviewId);
    company.featuredReview = reviewId;
    review.featured = true;
    res.json(await company.save() && await review.save());
  },
  addReply: async (req, res) => {
    const { reviewId } = req.params;
    const { reply } = req.body;
    const review = await Review.findById(reviewId);
    review.reply = reply;
    res.json(await review.save());
  },
};
