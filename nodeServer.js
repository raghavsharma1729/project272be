require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const modules = require("./modules");
const handler = require("./apiHandler");
const { schema, validate } = require("./apiSchema");

let callAndWait = () => {
  console.log("Kafka client has not connected yet, message will be lost");
};

callAndWait = async (fn, ...params) => modules[fn](...params);

const err = (msg) => ({ err: msg });
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

const apiVersion = "/apiV1";

[
  ["post", "/message", handler.common.postMessage, null],
  ["get", "/message/:orderId", handler.common.getMessages, null],
  ["get", "/location", handler.driver.getLocation, null],
  [
    "post",
    "/test/seedDummyReviews/:num",
    handler.employee.seedDummyReviews,
    null,
  ],
  ["get", "/test/dummyReviews/:limit", handler.employee.getDummyReviews, null],
  ["get", "/currentUser", handler.common.currentUser, null],
  [
    "post",
    "/signup/company",
    handler.common.signupCompany,
    null,
    schema.signupCompany,
  ],
  // retail_shop signup
  [
    "post",
    "/signup/retailShop",
    handler.common.signupRetailShop,
    null,
    schema.signupRetailShop,
  ],
  // list retail shops (direct query)
  ["get", "/list/retailShop", handler.retailShop.list, null, null],
  // shopper sign up
  [
    "post",
    "/signup/shopper",
    handler.common.signupShopper,
    null,
    schema.signupShopper,
  ],
  // list items (direct query)
  ["get", "/list/items", handler.retailItem.list, null, null],
  // list customers (direct query)
  ["get", "/list/customers", handler.employee.list, null, null],
  [
    "put",
    "/order/:retailOrderId/assignShopper",
    handler.retailShop.assignShopper,
    "retailShop",
    null,
  ],
  ["get", "/shopper/orders", handler.shopper.orders, null, null],
  ["get", "/retailShop/orders", handler.retailShop.orders, "retailShop", null],
  [
    "get",
    "/customer/retailOrders",
    handler.retailOrder.customerOrders,
    "employee",
    null,
  ],
  // create item for retail_shop dashboard
  [
    "post",
    "/items",
    handler.retailItem.create,
    "retailShop",
    schema.createRetailItem,
  ],
  [
    "post",
    "/order/:shopId/place",
    handler.retailOrder.createOrder,
    "employee",
    null,
  ],
  [
    "post",
    "/signup/employee",
    handler.common.signupEmployee,
    null,
    schema.signupEmployee,
  ],
  [
    "post",
    "/signup/driver",
    handler.common.signupDriver,
    null,
    schema.signupDriver,
  ],
  [
    "put",
    "/login/company",
    handler.common.loginCompany,
    null,
    schema.loginCompany,
  ],
  [
    "put",
    "/login/employee",
    handler.common.loginEmployee,
    null,
    schema.loginEmployee,
  ],
  // login retail shop
  [
    "put",
    "/login/retailShop",
    handler.common.loginRetailShop,
    null,
    schema.loginRetailShop,
  ],
  // login shopper
  [
    "put",
    "/login/shopper",
    handler.common.loginShopper,
    null,
    schema.loginShopper,
  ],
  [
    "put",
    "/login/driver",
    handler.common.loginDriver,
    null,
    schema.loginDriver,
  ],
  [
    "put",
    "/login/driver",
    handler.common.loginDriver,
    null,
    schema.loginDriver,
  ],
  ["put", "/login/admin", handler.common.loginAdmin, null, schema.loginAdmin],
  ["put", "/company", handler.company.update, "company", schema.updateCompany],
  ["put", "/driver", handler.driver.update, "driver", schema.updateDriver],
  [
    "put",
    "/retailShop",
    handler.retailShop.update,
    "retailShop",
    schema.updateRetailShop,
  ],

  ["post", "/file", handler.common.uploadFile, null],
  ["get", "/file/:id", handler.common.getFile, null],
  [
    "post",
    "/jobPosting",
    handler.company.addJobPosting,
    "company",
    schema.addJobPosting,
  ],
  ["get", "/jobPosting", handler.company.getJobPosting, "company"],
  [
    "get",
    "/company/:id/jobPosting",
    handler.company.getJobPostingByCompanyId,
    "admin",
  ],
  ["put", "/employee", handler.employee.update, "employee", schema.update],
  ["get", "/search/company", handler.employee.searchCompany, "any"],
  ["get", "/search/jobPosting", handler.employee.searchJobPosting, "employee"],
  ["get", "/company/profile/:id", handler.employee.getCompany, "any"],
  ["get", "/employee/profile/:id", handler.company.getEmployee, "any"],
  // api for customer to list products for a shop
  ["get", "/shop/:id/items", handler.retailShop.listItems, "employee"],
  ["get", "/retailShop/:id/items", handler.retailShop.listItems, "retailShop"],
  ["get", "/shops", handler.retailShop.list, "employee"],
  ["get", "/job/:id", handler.employee.getJob, "employee"],
  [
    "put",
    "/jobApplication/:id",
    handler.employee.applyJob,
    "employee",
    schema.applyJob,
  ],
  ["delete", "/jobApplication/:id", handler.employee.withdrawJob, "employee"],
  ["post", "/resume/:id", handler.employee.addResume, "employee"],
  ["put", "/resume/primary/:id", handler.employee.setPrimaryResume, "employee"],
  [
    "get",
    "/company/jobApplications",
    handler.company.jobApplications,
    "company",
  ],
  ["get", "/driver/jobApplications", handler.driver.getApplications, "driver"],
  ["put", "/assignDriver/:id", handler.company.assignDriver, "driver"],
  ["put", "/order/:id/assignDriver", handler.shopper.assignDriver, "driver"],
  ["put", "/orders/location/:id", handler.driver.locationUpdate, "driver"],
  [
    "get",
    "/employee/jobApplications",
    handler.employee.jobApplications,
    "employee",
  ],
  [
    "put",
    "/company/jobApplication/status/:id",
    handler.company.setJobApplicationStatus,
    "any",
  ],
  ["post", "/employee/salary/:id", handler.employee.addSalary, "employee"],
  [
    "get",
    "/jobPosting/company/:id",
    handler.employee.getCompanyJobPosting,
    "employee",
  ],
  ["post", "/review/:id", handler.employee.addReview, "employee"],
  [
    "put",
    "/review/helpfulVote/:id",
    handler.employee.addHelpfulVote,
    "employee",
  ],
  ["get", "/review/:id", handler.employee.getReviews, "employee"],
  ["post", "/companyPhoto/:id", handler.employee.addCompanyPhoto, "employee"],
  ["get", "/companyPhoto/:id", handler.employee.getCompanyPhotos, "any"],
  [
    "post",
    "/interviewExperience/:id",
    handler.employee.addInterviewExperience,
    "employee",
  ],
  [
    "get",
    "/interviewExperience/:id",
    handler.employee.getInterviewExperience,
    "employee",
  ],
  ["get", "/admin/reviews/:status", handler.admin.getReviews, "admin"],
  [
    "get",
    "/admin/reviews/:id/:status",
    handler.admin.getReviewsByCompanyIdAndStatus,
    "admin",
  ],
  [
    "get",
    "/admin/companyPhotos/:status",
    handler.admin.getPrivatePhotos,
    "admin",
  ],
  ["put", "/admin/reviews/:id", handler.admin.approveReview, "admin"],
  ["put", "/admin/companyPhotos/:id", handler.admin.approvePhoto, "admin"],
  ["get", "/admin/analytics", handler.admin.getAnalyticsData, "admin"],
  ["get", "/company/report", handler.company.getCompanyReport, "company"],
  [
    "get",
    "/company/:id/report",
    handler.company.getCompanyReportByCompanyId,
    "admin",
  ],
  ["get", "/employee/activity", handler.employee.getActivity, "employee"],
  ["get", "/company/reviews", handler.company.getCompanyReviews, "company"],
  [
    "put",
    "/company/favoriteReviews/:reviewId",
    handler.company.markFavorite,
    "company",
  ],
  [
    "put",
    "/company/featuredReview/:reviewId",
    handler.company.updateFeaturedReview,
    "company",
  ],
  ["put", "/company/reply/:reviewId", handler.company.addReply, "company"],
].forEach((r) => {
  app[r[0]](
    apiVersion + r[1],
    (req, resp, next) => {
      const token = req.header("authorization");
      req.session = {};
      if (token) {
        try {
          jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
          resp
            .status(401)
            .json(err("You need to login, your session has expired"));
        }
        req.session = jwt.decode(token);
      }

      console.log(r[3]);
      if (r[3] === "company" || r[3] === "employee" || r[3] === "admin") {
        const { scope } = req.session;
        if (scope !== r[3]) {
          resp.status(401).json(err("You are not authorized for this action."));
        }
      }
      if (r[3] === "any") {
        const { scope } = req.session;
        if (!scope) {
          resp.status(401).json(err("You need to login."));
        }
      }
      if (r[4]) {
        const { error } = validate(req.body, r[4]);
        if (error) {
          const messages = error.details.map((d) => d.message);
          resp.status(400).json(err(messages[0]));
        } else {
          req.requestKafka = callAndWait;
          next();
        }
      } else {
        req.requestKafka = callAndWait;
        next();
      }
    },
    async (req, res, next) => {
      try {
        await r[2](req, res, next);
      } catch (e) {
        next(e);
      }
    }
  );
});

// Handle errors
app.use((err, req, res, next) => {
  console.log(err);
  if (err) {
    const { message } = err;
    res.status(500).json({ err: "Something went wrong!", message });
  }
  next();
});

app.listen(parseInt(process.env.PORT));
module.exports = app; // used by mocha tests
