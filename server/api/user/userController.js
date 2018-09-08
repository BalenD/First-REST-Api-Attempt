const copyObject = require('../../util/clonePropertiesToNewObject');
const { findAllUsers } = require('./userService');

module.exports = class UserController {
  static async getAllUsers(obj, host, url) {
    //  TODO: ccheck if obj is query stirng
    const foundUsers = await findAllUsers(obj);
    if (foundUsers.length > 0) {
      for (let i = 0; i < foundUsers.length; i += 1) {
        foundUsers[i].SetUpHyperLinks(host, url);
      }
      return {
        result: {
          count: foundUsers.length,
          users: foundUsers,
        },
      };
    }
    return {
      status: 204,
      result: null,
    };
  }

  static async getOneUser(req, res, next) {
    try {
      const foundUser = await User.findOne({ _id: req.params.id }, 'username email links role employee').populate('employee', 'firstName lastName email phoneNumber links');
      foundUser.SetUpHyperLinks(req.headers.host, req.originalUrl);
      foundUser.employee.SetUpHyperLinks(req.headers.host, '/api/v1/employees/');
      res.status(200).json(foundUser);
    } catch (error) {
      next(error);
    }
  }

  static async createOneUser(req, res, next) {
    try {
      const [foundUser, foundEmail] = Promise.all([
        User.findOne({ username: req.body.username }).lean(),
        User.findOne({ email: req.body.email }).lean(),
      ]);
      if (foundUser) {
        return res.status(409).json({
          status: 409,
          message: 'Username already exists',
        });
      }
      if (foundEmail) {
        return res.status(409).json({
          status: 409,
          message: 'Email already exists',
        });
      }
      const role = `${req.body.role.substring(0, 1).toUpperCase()}${req.body.role.substring(1, req.body.role.length).toLowerCase()}`;
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        role,
        password: req.body.password,
      };
      const createdUser = await User.create(newUser);
      createdUser.SetUpHyperLinks(req.headers.host, req.originalUrl);
      return res.status(201).json(createdUser.removePassword());
    } catch (error) {
      return next(error);
    }
  }

  static async updateOneUser(req, res, next) {
    try {
      req.body = copyObject(req.body, '_id employee');
      const updatedUser = await User
        .findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true, fields: 'username email role links' });
      updatedUser.SetUpHyperLinks(req.headers.host, req.originalUrl);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  static async deleteOneUser(req, res, next) {
    try {
      await User.findOneAndRemove({ _id: req.params.id });
      res.status(200).json({ status: 200, message: 'Successfully deleted user' });
    } catch (error) {
      next(error);
    }
  }
};
