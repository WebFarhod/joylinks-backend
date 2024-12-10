const Comment = require("../models/comment.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const { Types } = require("mongoose");
const contactService = require("../services/contact.service");

class Contact {
  async add(req, res, next) {
    try {
      const { message, phone } = req.body;
      const user = req.user;
      if (!message || !phone) {
        return res
          .status(400)
          .json({ error: "Talab qilingan ma'lumotlar mavjud emas." });
      }
      const data = await contactService.create(message, phone, user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await contactService.getAll(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async contacted(req, res, next) {
    try {
      const { id } = req.params;
      const data = await contactService.contacted(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async read(req, res, next) {
    try {
      const { id } = req.params;
      const data = await contactService.read(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const data = await contactService.delete(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Contact();
