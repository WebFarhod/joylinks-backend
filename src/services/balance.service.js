const mongoose = require("mongoose");
const Banner = require("../models/banner.model");
const BaseError = require("../utils/baseError");
const Wallet = require("../models/wallet.model");

class BalanceService {
  async processPayment(payment_type, amount, user_id) {
    const Mid = process.env.PAYME_MERCHANT_ID;
    console.log("====================================");
    console.log(Mid);
    console.log("====================================");
    if (!Mid) {
      return "merchant id topilmadi";
    }
    console.log(payment_type, amount, user_id);

    if (payment_type === "payme") {
      const params = {
        m: Mid,
        "ac.user_id": user_id,
        a: amount * 100,
      };

      let queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join(";");

      console.log("====================================");
      console.log("Yaratilgan Query String:", queryString);
      console.log("====================================");

      let base64String = Buffer.from(
        ` m=${Mid};ac.user_id=${user_id};a=${amount * 100}`
      ).toString("base64");

      let paymeUrl = `https://checkout.paycom.uz/${base64String}`;
      console.log("sdfsdfsdfsd", paymeUrl);

      return paymeUrl;
    }
  }
  async create(amount, user, payment_type) {
    let wallet = await Wallet.findOne({ user_id: user.sub });
    if (wallet) {
      wallet.amount = amount;
      wallet.save();
    } else {
      wallet = new Wallet({
        amount,
        user_id: user.sub,
      });
      await wallet.save();
    }
    const paymentSuccess = await this.processPayment(
      payment_type,
      amount,
      user.sub
    );
    console.log("dfDf", paymentSuccess);

    return paymentSuccess;
  }
}

module.exports = new BalanceService();
