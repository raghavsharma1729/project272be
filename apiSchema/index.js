const Joi = require("joi");

const validate = (body, schema) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: false, // remove unknown props
  };
  return schema.validate(body, options);
};

const reqStr = (label) => Joi.string().required().label(label);
const reqNum = (label) => Joi.number().required().label(label);
const optNum = (label) => Joi.number().label(label);
const optStr = (label) => Joi.string().allow("").label(label);
const optFiles = () => Joi.array().items(Joi.string()).label("Files");

// Doc - https://joi.dev/api/?v=17.3.0
// TODO : complete verify schema for all create and update apis, allowUnknown should be set to false
const schema = {
  signupCompany: Joi.object({
    name: reqStr("Buyer name"),
    email: Joi.string().email().required().label("Buyer email"),
    password: reqStr("Password"),
  }),
  signupRetailShop: Joi.object({
    name: reqStr("shop name"),
    email: Joi.string().email().required().label("shop email"),
    password: reqStr("Password"),
  }),
  signupShopper: Joi.object({
    name: reqStr("shopper name"),
    email: Joi.string().email().required().label("shopper email"),
    password: reqStr("Password"),
    retailShop: reqStr("affiliate shop id"),
  }),
  createRetailItem: Joi.object({
    title: reqStr("item name"),
    price: reqNum("item price"),
  }),
  signupEmployee: Joi.object({
    name: reqStr("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(3).required(),
  }),
  signupDriver: Joi.object({
    name: reqStr("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(3).required(),
  }),
  updateCompany: Joi.object({
    website: Joi.string().domain().label("Website"),
  }),
  updateRetailShop: Joi.object({}),
  addJobPosting: Joi.object({
    title: reqStr("Product name"),
    industry: reqStr("Industry"),
    country: reqStr("Country"),
    streetAddress: reqStr("Street address"),
    city: reqStr("City"),
    state: reqStr("State"),
    zip: reqStr("Zip"),
  }),
  applyJob: Joi.object({}),
  loginEmployee: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required(),
  }),
  loginRetailShop: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required(),
  }),
  loginShopper: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required(),
  }),
  loginCompany: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required(),
  }),
  loginAdmin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().allow("").optional(),
    race: optStr("Race"),
    disability: optStr("Disability"),
    veteranStatus: optStr("Veteran status"),
    jobTitleLookingFor: optStr("Job title looking for"),
    typeOfIndustry: optStr("Type of industry"),
    targetSalary: optNum("Salary"),
  }),
};

module.exports = { schema, validate };
