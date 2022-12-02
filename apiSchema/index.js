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
  signupSeller: Joi.object({
    name: reqStr("Seller name"),
    email: Joi.string().email().required().label("Seller email"),
    password: reqStr("Password"),
  }),
  signupCustomer: Joi.object({
    name: reqStr("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(3).required(),
  }),
  signupDriver: Joi.object({
    name: reqStr("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(3).required(),
  }),
  updateSeller: Joi.object({
    description: Joi.string().label("description"),
  }),
  addItem: Joi.object({
    title: reqStr("Product name"),
    description: reqStr("Industry"),
    price: reqNum("price"),
    condition: reqStr("condition"),
    brand: reqStr("brand"),
    purchasedDate: reqStr("purchasedDate"),
  }),
  putOrder: Joi.object({}),
  loginCustomer: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required(),
  }),
  loginSeller: Joi.object({
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
