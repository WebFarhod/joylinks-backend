const { default: mongoose } = require("mongoose");
const BaseError = require("../utils/baseError");
const Category = require("../models/category.model");
const Contact = require("../models/contact.model");

class ContactService {
  async create(message, phone, user) {
    if (user) {
      const newContact = new Contact({
        userId: user.sub,
        message,
        phone,
      });
      await newContact.save();
    }
    const newContact = new Contact({
      userId: null,
      message,
      phone,
    });
    await newContact.save();

    return { message: "Ma'lumotlar yuborildi." };
  }

  async contacted(id) {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw BaseError.NotFoundError("Ma'lumot topilmadi.");
    }
    contact.isContacted = true;
    await contact.save();
    return {
      message: "Xabar bo'g'lanildi deb belgilandi.",
    };
  }

  async read(id) {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw BaseError.NotFoundError("Ma'lumot topilmadi.");
    }
    contact.isRead = true;
    await contact.save();
    return {
      message: "Xabar o'qildi deb belgilandi.",
    };
  }

  async delete(id) {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw BaseError.NotFoundError("Ma'lumot topilmadi.");
    }
    contact.isRead = true;
    return {
      message: "Xabar o'chirildi",
    };
  }

  async getAll(query) {
    const { isRead, isContacted, page = 1, limit = 10 } = query;
    let filter = {};
    if (isRead !== undefined) {
      filter.isRead = isRead;
    }
    if (isContacted !== undefined) {
      filter.isContacted = isContacted;
    }

    const contacts = await Contact.aggregate([
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);
    // Umumiy soni
    const total = await Contact.countDocuments(filter);

    return {
      total,
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    };
  }
}

module.exports = new ContactService();
