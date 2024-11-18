const { Schema, model } = require("mongoose");
const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      require: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = model("banners", bannerSchema);
module.exports = Banner;
