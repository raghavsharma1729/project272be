const { Review, CompanyPhoto } = require('../../mongodb');

module.exports = {
  getReviews: async (req, res) => {
    const reviews = await Review.find({
      status: req.params.status,
    })
      .populate('company', 'name')
      .populate('employee', 'email');
    return res.json(reviews);
  },
  getReviewsByCompanyIdAndStatus: async (req, res) => {
    const reviews = await Review.find({
      status: req.params.status,
      company: req.params.id,
    })
      .populate('company', 'name')
      .populate('employee', 'email');
    return res.json(reviews);
  },
  getPrivatePhotos: async (req, res) => {
    const images = await CompanyPhoto.find({
      status: req.params.status,
    })
      .populate('company', 'name')
      .populate('employee', 'email');
    return res.json(images);
  },
  approveReview: async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (req.body.status === 'approved') review.status = 'approved';
    else review.status = 'rejected';
    return res.json(await review.save());
  },
  approvePhoto: async (req, res) => {
    const photo = await CompanyPhoto.findById(req.params.id);
    if (req.body.status === 'approved') photo.status = 'approved';
    else photo.status = 'rejected';
    return res.json(await photo.save());
  },
  getAnalyticsData: async (req, res) => {
    const topFiveCompaniesWithMostreviews = await Review.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'name',
        },
      },
      { $unwind: '$name' },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          name: { $addToSet: '$name' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topFiveCompanyWithBestAverageRating = await Review.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'name',
        },
      },
      { $unwind: '$name' },
      {
        $group: {
          _id: '$company',
          average: { $avg: '$overallRating' },
          name: { $addToSet: '$name' },
        },
      },
      { $sort: { average: -1 } },
      { $limit: 5 },
    ]);

    const topFiveStudentsWithMostAcceptedReviewsMade = await Review.aggregate([
      {
        $match: { status: 'approved' },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'name',
        },
      },
      { $unwind: '$name' },
      {
        $group: {
          _id: '$employee',
          count: { $sum: 1 },
          name: { $addToSet: '$name' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topTenCeoBasedOnRating = await Review.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'name',
        },
      },
      { $unwind: '$name' },
      {
        $group: {
          _id: '$company',
          ceoRating: { $avg: '$ceoApprovalRating' },
          name: { $addToSet: '$name' },
        },
      },
      { $sort: { ceoRating: -1 } },
      { $limit: 10 },
    ]);

    const dataToBeReturned = {
      topFiveCompaniesWithMostreviews,
      topFiveCompanyWithBestAverageRating,
      topFiveStudentsWithMostAcceptedReviewsMade,
      topTenCeoBasedOnRating,
    };
    return res.json(dataToBeReturned);
  },
};
