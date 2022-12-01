const mongoose = require("mongoose");

console.log("Using mongo connection string", process.env.MONGODB_CONNECTION);

mongoose.connect(process.env.MONGODB_CONNECTION, {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("error", () => {
  console.log("Mongo error");
});
mongoose.connection.once("open", () => {
  console.log("Connected to mongo");
});

// Import and re-export models here

const Company = require("./schemas/company")(mongoose);
const Employee = require("./schemas/customer")(mongoose);
const Driver = require("./schemas/driver")(mongoose);
const JobPosting = require("./schemas/jobPosting")(mongoose);
const JobApplication = require("./schemas/jobApplication")(mongoose);
const CompanySalary = require("./schemas/companySalary")(mongoose);
const Review = require("./schemas/review")(mongoose);
const CompanyPhoto = require("./schemas/companyPhoto")(mongoose);
const InterviewExperience = require("./schemas/interviewExperience")(mongoose);
const DriverLocation = require("./schemas/location")(mongoose);
const Messages = require("./schemas/messages")(mongoose);
const RetailItem = require("./schemas/retailItem")(mongoose);
const RetailOrder = require("./schemas/retailOrder")(mongoose);
const RetailShop = require("./schemas/retailShop")(mongoose);
const Shopper = require("./schemas/shopper")(mongoose);

module.exports = {
  Company,
  Employee,
  Driver,
  JobPosting,
  JobApplication,
  CompanySalary,
  Review,
  CompanyPhoto,
  InterviewExperience,
  DriverLocation,
  Messages,
  RetailItem,
  RetailOrder,
  RetailShop,
  Shopper,
};
