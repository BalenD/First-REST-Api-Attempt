const { body } = require('express-validator/check');
const moment = require('moment');
const Employee = require('../../api/employee/employeeModel');

exports.createFields = [
  body('firstName')
    .exists().withMessage('firstName must not be empty')
    .isString().withMessage('firstName must be a string'),

  body('lastName', 'Must specify a valid string')
    .exists().withMessage('lastName must not be empty')
    .isString().withMessage('lastName must be a string'),

  body('birthday')
    .custom((birthday) => {
      const birthDate = moment(birthday, 'YYYY/MM/DD', true);
      if (birthDate.isValid()) {
        return true;
      }
      return false;
    })
    .withMessage('birthday is not a valid format')
    .custom((birthday) => {
      const fifteenYearsAgo = moment().subtract(15, 'years');
      const birthDate = moment(birthday, 'YYYY/MM/DD', true);
      if (!birthDate.isValid()) {
        return false;
      }
      if (fifteenYearsAgo > birthDate) {
        return true;
      }
      return false;
    })
    .withMessage('birthday must be at least 18 years or older'),

  body('email', 'Must specify a valid email')
    .isString().withMessage('email must be a string')
    .isEmail().withMessage('email must be a valid email')
    .custom(async (email) => {
      const foundEmail = await Employee.findOne({ email }).lean();
      if (!foundEmail) {
        return true;
      }
      return false;
    })
    .withMessage('email already exists'),

  body('city')
    .exists().withMessage('city must not be empty')
    .isString().withMessage('city must be a string'),

  body('country')
    .exists().withMessage('country must not be empty')
    .isString().withMessage('country must be a string'),

  body('street')
    .exists().withMessage('street must not be empty')
    .isString().withMessage('street must be a string'),

  body('phoneNumber')
    .isNumeric().withMessage('phoneNumber must be a number')
    .isMobilePhone('da-DK').withMessage('phoneNumber must be a valid phone number'),

  body('startDate')
    .custom((startDate) => {
      const birthDate = moment(startDate, 'YYYY/MM/DD', true);
      if (birthDate.isValid()) {
        return true;
      }
      return false;
    })
    .withMessage('startDate is not a valid format'),
  body('lastChanged')
    .isEmpty().withMessage('lastChanged must be left empty'),
];

exports.updateFields = [
  body('_id')
    .isEmpty().withMessage('_id must be empty'),

  body('firstName')
    .isString().withMessage('firstName must be a string')
    .optional(),

  body('lastName')
    .isString('lastName must be a string')
    .optional(),

  body('birthday', 'Must specify a valid birthday')
    .custom((birthday) => {
      const birthDate = moment(birthday, 'YYYY/MM/DD', true);
      if (birthDate.isValid()) {
        return true;
      }
      return false;
    })
    .withMessage('birthday is not a valid format')
    .custom((birthday) => {
      const fifteenYearsAgo = moment().subtract(15, 'years');
      const birthDate = moment(birthday, 'YYYY/MM/DD', true);
      if (!birthDate.isValid()) {
        return false;
      }
      if (fifteenYearsAgo > birthDate) {
        return true;
      }
      return false;
    })
    .withMessage('birthday must be at least 18 years or older')
    .optional(),

  body('email')
    .isString().withMessage('email must be a string')
    .isEmail().withMessage('email must be a valid email')
    .custom(async (email) => {
      const foundEmail = await Employee.findOne({ email }).lean();
      if (!foundEmail) {
        return true;
      }
      return false;
    })
    .withMessage('email already exists')
    .optional(),

  body('city')
    .isString().withMessage('city must be a string')
    .optional(),

  body('user')
    .isEmpty().withMessage('user must be empty'),

  body('country')
    .isString().withMessage('country must be a string')
    .optional(),

  body('street')
    .isString().withMessage('street must be a string')
    .optional(),

  body('phoneNumber', 'Must specify a valid phone number')
    .isNumeric().withMessage('phoneNumber must be a number')
    .isMobilePhone('da-DK').withMessage('phoneNumber must be a valid number')
    .optional(),

  body('startDate')
    .custom((startDate) => {
      const birthDate = moment(startDate, 'YYYY/MM/DD', true);
      if (birthDate.isValid()) {
        return true;
      }
      return false;
    })
    .withMessage('startDate is not a valid format')
    .optional(),

  body('lastChanged')
    .isEmpty().withMessage('lastChanged must be empty'),
];
