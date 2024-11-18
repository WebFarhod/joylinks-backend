const mongoose = require("mongoose");
const Banner = require("../models/banner.model");
const BaseError = require("../utils/baseError");

class BannerService {
  async create(title, image, link, isActive) {
    const newBanner = new Banner({
      title,
      image: image || null,
      link: link || null,
      isActive: isActive || false,
    });
    await newBanner.save();
    return { message: "Banner yaratildi." };
  }

  async getAll(user) {
    let filter = {};
    if (user && user.role === "admin") {
      filter = {};
    } else {
      filter.isActive = true;
    }
    const banners = await Banner.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          link: 1,
          isActive: 1,
        },
      },
    ]);
    return banners;
  }

  async get(user, id) {
    let filter = { _id: new mongoose.Types.ObjectId(id) };
    if (!(user && user.role === "admin")) {
      filter.isActive = true;
    }
    const banner = await Banner.aggregate([
      { $match: filter },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          link: 1,
          isActive: 1,
        },
      },
    ]);
    return banner.length > 0 ? banner[0] : null;
  }

  async update(id, bannerData) {
    const updateData = {};
    if (bannerData.title) updateData.title = bannerData.title;
    if (bannerData.image) updateData.image = bannerData.image;
    if (bannerData.link) updateData.link = bannerData.link;
    if (bannerData.isActive) updateData.isActive = bannerData.isActive;
    if (Object.keys(updateData).length === 0) {
      throw BaseError.BadRequest(
        "Yangilash uchun hech qanday ma'lumot berilmagan."
      );
    }
    const banner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!banner) {
      throw BaseError.NotFoundError("Banner topilmadi.");
    }
    return {
      message: "Banner muvaffaqiyatli yangilandi.",
    };
  }

  async delete(id) {
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      throw BaseError.BadRequest("Banner topilmadi.");
    }
    return { message: "Banner o'chirildi" };
  }
}

module.exports = new BannerService();
