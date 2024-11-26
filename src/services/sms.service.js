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
      // return "ok";

      const response = await axios.post(
        "https://notify.eskiz.uz/api/message/sms/send",
        {
          mobile_phone: phoneNumber,
          message: `joylinks sayti uchun tasdiqlash kodi: ${code}`,
          from: "4546", // Eskiz tomonidan tasdiqlangan "from" nomi
          callback_url: "", // Agar kerak bo'lsa, qo'shing
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUxOTY4NjIsImlhdCI6MTczMjYwNDg2Miwicm9sZSI6InVzZXIiLCJzaWduIjoiOWIyYjVkMzBkOWZjN2Y1MzU0YWViMzc2YzI1NmYyMTczNDRjMGEwYjgyZGY3ODYzY2NiMWRkNmFkN2QxYzUzZiIsInN1YiI6IjYxMTQifQ.TKM17UxGi5mUZ5TA60FtSD-FY8bxsHNjHIOvCCwaHWc`,
          },
        }
      );

      console.log("data", data);
      return "ok";

      // res.status(200).json({
      //   message: "SMS sent successfully",
      //   data: response.data,
      // });
    } catch (error) {
      console.error("SMS yuborish xatosi:", error);
      return null;
    }
  }
}

module.exports = new SmsService();
