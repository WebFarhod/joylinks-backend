const bannerService = require("../services/banner.service");
const smsService = require("../services/sms.service");

class SmsController {
  async send(req, res, next) {
    try {
      const { phone, code } = req.body;
    //   if (!phone || !code) {
    //     res.status(400).json({ error: "Talab qilinga malumotlar mavjud emas" });
    //   }
      const data = await smsService.sendCode(phone, code);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SmsController();
