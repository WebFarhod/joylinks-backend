const balanceService = require("../services/balance.service");

class BalanceController {
  async createBalance(req, res, next) {
    try {
      const { amount, payment_type } = req.body;
      const user = req.user;
      if (!amount || !payment_type) {
        res.status(400).json({ error: "Talab qilinga malumotlar mavjud emas" });
      }
      const data = await balanceService.create(amount, user, payment_type);
      return res.status(201).json(data);
    } catch (error) {
      console.log("err", error);

      next(error);
    }
  }
}

module.exports = new BalanceController();
