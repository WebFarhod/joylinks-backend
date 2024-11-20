const axios = require("axios");

class SmsService {
  async sendCode(phoneNumber, code) {
    // const normalizedPhoneNumber = phoneNumber.slice(1);
    // const data = {
    //   phone_number: normalizedPhoneNumber,
    //   message: `www.assos.uz sayti uchun tasdiqlash kodi: ${code}`,
    // };

    try {
    //   const res = await axios.post("http://93.127.163.78:3010/api", data, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "User-Agent": "insomnia/9.3.3",
    //       Authorization:
    //         "Bearer c072X2T6i9SuapZR13cGzYzY86l8AuIYC55m19tqSooqgVxsJ7dmfVL3hXhR65Qa",
    //     },
    //   });

    //   if (res.data && res.data.status === "waiting") {
    //     return "ok";
    //   }
    //   console.error("SMS yuborish xatosi:", res.data);
    //   return null;
    return "ok"
    } catch (error) {
      console.error("SMS yuborish xatosi:", error);
      return null;
    }
  }
}

module.exports = new SmsService();
