const bannerService = require("../services/banner.service");

class BannerController {
  async createBanner(req, res, next) {
    try {
      const { title, image, link, isActive } = req.body;
      if (!title) {
        res.status(400).json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await bannerService.create(title, image, link, isActive);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getBanners(req, res, next) {
    try {
      const user = req.user;
      const data = await bannerService.getAll(user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getBannerById(req, res, next) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await bannerService.get(user, id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateBanner(req, res, next) {
    try {
      const bannerData = req.body;
      if (!bannerData) {
        return res.status(400).json({
          message: "Yangilash uchun hech qanday ma'lumot berilmagan.",
        });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await bannerService.update(id, bannerData);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteBanner(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "id mavjud emas." });
      }
      const data = await bannerService.delete(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BannerController();
