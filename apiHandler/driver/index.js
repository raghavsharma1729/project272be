const {
  Employee,
  Driver,
  JobPosting,
  Company,
  JobApplication,
  CompanySalary,
  Review,
  CompanyPhoto,
  InterviewExperience,
  DriverLocation,
  RetailOrder,
} = require("../../mongodb");
const mongoose = require("mongoose");

const kModules = require("../../modules");
const { driver } = require("mongoose");

module.exports = {
  locationUpdate: async (req, res) => {
    const orderLocation = await DriverLocation.find({ orderId: req.params.id });

    if (orderLocation.length === 0) {
      const driverLocation = new DriverLocation({
        orderId: req.params.id,
        location: [req.body],
      });
      return res.json(await driverLocation.save());
    } else {
      const driverLocation = orderLocation[0];
      newLocations = driverLocation.location;
      newLocations.push(req.body);
      driverLocation.location = newLocations;
      res.json(await driverLocation.save());
    }
  },

  getLocation: async (req, res) => {
    const locations = await DriverLocation.find().limit(1);
    res.json(locations[0]);
  },
  update: async (req, resp) => {
    const driver = await Driver.findById(req.session.user._id);
    Object.assign(driver, req.body);
    const dri = await driver.save();
    resp.json(dri);
  },
  getApplications: async (req, res) => {
    const driverId = req.session.user._id;
    console.log(driverId);
    const result = await RetailOrder.find({ driver: driverId })
      .populate("orderItems")
      .populate("shopper")
      .populate("driver")
    console.log('------------');
    console.log(result);
    res.json(
      await JobApplication.find({ driver: driverId })
        .populate("job")
        .populate("employee")
        .populate("driver")
    );
  },
  searchCompany: async (req, res) => {
    const { text } = req.query;
    // TODO Use text index search
    const companies = await Company.find({
      name: { $regex: text, $options: "i" },
    });
    const getData = async () =>
      Promise.all(
        companies.map(async (company) => {
          const reviews = await Review.find({
            company: company._id,
            status: "approved",
          });
          const reviewAvg = await Review.aggregate([
            { $match: { company: company._id, status: "approved" } },
            {
              $group: { _id: "$company", average: { $avg: "$overallRating" } },
            },
          ]);
          const reviewCount = reviews.length;
          const salaryCount = await CompanySalary.find({
            company: company._id,
          }).count();
          const interviewCount = await InterviewExperience.find({
            company: company._id,
          }).count();

          return {
            ...company.toJSON(),
            reviewCount,
            salaryCount,
            reviewAvg,
            interviewCount,
          };
        })
      );

    res.json(await getData());
  },
  searchJobPosting: async (req, res) => {
    const { text } = req.query;
    // TODO Use text index search
    res.json(
      await JobPosting.find({ title: { $regex: text, $options: "i" } })
        .populate("company")
        .sort({ createdAt: -1 })
    );
  },

  getCompany: async (req, res) => {
    res.json({});
  },
  getJob: async (req, res) => {
    const jobId = req.params.id;
    const jobPosting = await JobPosting.findById(jobId).populate("company");
    res.json(jobPosting);
  },
  applyJob: async (req, res) => {
    const jobId = req.params.id;
    const jobPosting = await JobPosting.findById(jobId);
    const employeeId = req.session.user._id;
    const jobApplication = new JobApplication({
      ...req.body,
      job: jobId,
      employee: employeeId,
      company: jobPosting.company,
      status: "Order placed",
    });
    res.json(await jobApplication.save());
  },
  withdrawJob: async (req, res) => {
    const jobId = req.params.id;
    res.json(await JobApplication.findByIdAndDelete(jobId));
  },
  addResume: async (req, res) => {
    const fileId = req.params.id;
    const { fileName } = req.body;
    const employee = await Employee.findById(req.session.user._id);
    if (employee.resumes.length === 0) {
      employee.primaryResume = fileId;
    }
    employee.resumes.push({ fileId, fileName });
    res.json(await employee.save());
  },
  setPrimaryResume: async (req, res) => {
    const fileId = req.params.id;
    const employee = await Employee.findById(req.session.user._id);
    employee.primaryResume = fileId;
    res.json(await employee.save());
  },
  jobApplications: async (req, res) => {
    const employeeId = req.session.user._id;
    res.json(
      await JobApplication.find({ employee: employeeId }).populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
    );
  },
  addSalary: async (req, res) => {
    const employeeId = req.session.user._id;
    const { id: jobPostingId } = req.params;
    const { company } = await JobPosting.findById(jobPostingId);
    const companySalary = new CompanySalary({
      ...req.body,
      company,
      jobPosting: jobPostingId,
      employee: employeeId,
    });
    res.json(await companySalary.save());
  },
  getCompanyJobPosting: async (req, res) => {
    const companyId = req.params.id;
    res.json(await kModules.getCompanyJobPosting(companyId));
    // With  redis
    // const key = `companyJobPosting${companyId}`;
    // if (await redisGet(key) === null) {
    //   await redisSet(key, await kModules.getCompanyJobPosting(companyId));
    // }
    // res.json(await redisGet(key));
  },
  addReview: async (req, res) => {
    const { id: companyId } = req.params;
    const employeeId = req.session.user._id;
    const newReview = { ...req.body, company: companyId, employee: employeeId };
    // await kModules.addReview(newReview);
    // res.json(newReview);
    res.json(await req.requestKafka("addReview", newReview));
  },
  seedDummyReviews: async (req, res) => {
    const genReview = () => {
      const companyId = "5fb52103232cac00201b3dfe";
      const employeeId = "5fb5219f232cac00201b3dff";
      const r = {
        overallRating: "5",
        ceoApprovalRating: "5",
        headline: "Great",
        description: "I like this company",
        pros: "People",
        cons: "Nothing",
        recommendToFriend: true,
      };
      return { ...r, company: companyId, employee: employeeId };
    };
    const reviews = [];
    const n = parseInt(req.params.num);
    for (let i = 0; i < n; i += 1) {
      reviews.push(genReview());
    }
    await Review.insertMany(reviews, { ordered: false });
    res.json(true);
  },
  getDummyReviews: async (req, res) => {
    const limit = parseInt(req.params.limit);
    const companyId = "5fb52103232cac00201b3dfe";

    // With redis
    // const key = `getDummyReviews${companyId}${limit}`;
    // if (await redisGet(key) === null) {
    //   await redisSet(key, await kModules.getDummyReviews(companyId, limit));
    // }
    // res.json(await redisGet(key));

    // With kafka
    // res.json(await req.requestKafka('getDummyReviews', companyId, limit));

    // Base
    res.json(await kModules.getDummyReviews(companyId, limit));
  },
  getReviews: async (req, res) => {
    const { id: companyId } = req.params;
    const reviews = await Review.find({
      $and: [
        { company: companyId },
        { $or: [{ employee: req.session.user._id }, { status: "approved" }] },
      ],
    })
      .populate("employee", "-resumes")
      .sort({ createdAt: -1 });
    let mostNegativeReview = null;
    let mostPositiveReview = null;
    let overallRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      if (
        !reviews[i].recommendToFriend &&
        (!mostNegativeReview ||
          (mostNegativeReview.helpfulVotes.length <=
            reviews[i].helpfulVotes.length &&
            mostNegativeReview.overallRating > reviews[i].overallRating))
      ) {
        mostNegativeReview = reviews[i];
      }
      if (
        reviews[i].recommendToFriend &&
        (!mostPositiveReview ||
          (mostPositiveReview.helpfulVotes.length <=
            reviews[i].helpfulVotes.length &&
            mostPositiveReview.overallRating < reviews[i].overallRating))
      ) {
        mostPositiveReview = reviews[i];
      }
      overallRating += reviews[i].overallRating;
    }

    res.json({
      mostPositiveReview,
      mostNegativeReview,
      reviews,
      averageRating: overallRating / reviews.length,
      employeeId: req.session.user._id,
    });
  },
  addCompanyPhoto: async (req, res) => {
    const { id: companyId } = req.params;
    const employeeId = req.session.user._id;
    const review = new CompanyPhoto({
      ...req.body,
      company: companyId,
      employee: employeeId,
    });
    res.json(await review.save());
  },
  getCompanyPhotos: async (req, res) => {
    const { id: companyId } = req.params;
    res.json(
      await CompanyPhoto.find({
        $and: [
          { company: companyId },
          { $or: [{ employee: req.session.user._id }, { status: "approved" }] },
        ],
      })
        .populate("employee", "-resumes")
        .sort({ createdAt: -1 })
    );
  },
  addInterviewExperience: async (req, res) => {
    const employeeId = req.session.user._id;
    const { id: companyId } = req.params;
    const interviewExperience = new InterviewExperience({
      ...req.body,
      company: companyId,
      employee: employeeId,
    });
    res.json(await interviewExperience.save());
  },
  getInterviewExperience: async (req, res) => {
    const { id: companyId } = req.params;
    res.json(
      await InterviewExperience.find({ company: companyId })
        .populate("employee", "-resumes")
        .sort({ createdAt: -1 })
    );
  },

  addHelpfulVote: async (req, res) => {
    const { id: reviewId } = req.params;
    res.json(
      await Review.update(
        { _id: reviewId },
        { $push: { helpfulVotes: req.session.user._id } }
      )
    );
  },
  getActivity: async (req, res) => {
    const employeeId = req.session.user._id;
    const reviews = await Review.find({ employee: employeeId }).populate(
      "company"
    );

    const interviewExperiences = await InterviewExperience.find({
      employee: employeeId,
    })
      .populate("company")
      .populate("jobPosting");

    const companySalaries = await CompanySalary.find({ employee: employeeId })
      .populate("company")
      .populate("jobPosting");

    const companyPhotos = await CompanyPhoto.find({
      employee: employeeId,
    }).populate("company");

    res.json({ reviews, interviewExperiences, companySalaries, companyPhotos });
  },
};
