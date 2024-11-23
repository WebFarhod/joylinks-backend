const { Schema, model } = require("mongoose");

const testSchema = new Schema(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "lessons",
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: [true, "Savol bo'sh bo'lmasligi kerak"],
        //   minlength: [5, "Savol kamida 5 ta belgi bo'lishi kerak"],
        },
        options: {
          type: [String],
          validate: {
            validator: function (value) {
              return value.length >= 2;
            },
            message: "Har bir savol kamida 2 ta variantga ega bo'lishi kerak",
          },
        },
        correctAnswer: {
          type: String,
          required: [true, "To'g'ri javob bo'lishi shart"],
          validate: {
            validator: function (value) {
              return this.options.includes(value);
            },
            message: "To'g'ri javob variantlar orasida bo'lishi kerak",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Test = model("test", testSchema);

module.exports = Test;
