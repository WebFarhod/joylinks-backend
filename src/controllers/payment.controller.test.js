// const { PaymeState } = require("../enums/PaymeState");
// const Transaction = require("../models/payme.transaction.model");
// const User = require("../models/user.model");
// const Wallet = require("../models/payment.model");

// // const Course = require("../models/course.model");

// // const StudentCourse = require("../models/studentCourse.model");
// const sendError = (res, code, message) => {
//   res.json({
//     error: {
//       code,
//       message,
//     },
//   });
// };

// exports.payme = async (req, res, next) => {
//   try {
//     const { method, params } = req.body;

//     switch (method) {
//       case "CheckPerformTransaction": {
//         const result = await checkPerformTransaction(params, res);
//         return res.json(result);
//       }
//       case "CreateTransaction": {
//         const result = await createTransaction(params, res);
//         return res.json(result);
//       }
//       case "PerformTransaction": {
//         const result = await performTransaction(params, res);
//         return res.json(result);
//       }
//       case "CheckTransaction": {
//         const result = await checkTransaction(params, res);
//         return res.json(result);
//       }

//       case "CancelTransaction": {
//         const result = await cancelTransaction(params, res);
//         return res.json(result);
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// };

// const checkPerformTransaction = async (params, res) => {
//   try {
//     const {
//       account: { user_id,  },
//     } = params;
//     let { amount } = params;
//     const user = await User.findById(user_id);
//     if (!user) {
//       throw sendError(res, -31050, "User topilmadi.");
//     }
//     amount = Math.floor(amount / 100);
//     const wallet = await Wallet.findOne({ user_id });
//     if (!wallet) {
//       throw sendError(res, -31050, "User topilmadi.");
//     }
//     if (amount !== wallet.amount) {
//       throw sendError(res, -31001, "Noto'g'ri summa.");
//     }

//     return {
//       result: {
//         allow: true,
//       },
//     };
//   } catch (error) {
//     throw sendError(res, -31050, "xatolik sodir bo'ldi.");
//   }
// };

// const createTransaction = async (params, res) => {
//   const {
//     id,
//     account: { user_id },
//     time,
//   } = params;
//   let { amount } = params;

//   amount = Math.floor(amount / 100);

//   let transaction = await Transaction.findOne({ id });

//   if (transaction) {
//     if (transaction.state !== PaymeState.Pending) {
//       throw sendError(res, -31008, "Operatsiyani amalga oshirish mumkin emas.");
//     }

//     const currentTime = Date.now();

//     const expirationTime = (currentTime - transaction.createdAt) / 60000 < 12;

//     if (!expirationTime) {
//       await Transaction.updateById(params.id, {
//         state: PaymeState.PendingCanceled,
//         reason: 4,
//       });

//       throw sendError(res, -31008, "Operatsiyani amalga oshirish mumkin emas.");
//     }

//     return {
//       result: {
//         transaction: transaction.id,
//         state: transaction.state,
//         create_time: transaction.create_time,
//       },
//     };
//   }
//   await checkPerformTransaction(params, res);

//   transaction = await Transaction.findOne({
//     user_id,
//   });
//   if (transaction) {
//     if (transaction.state === PaymeState.Paid)
//       throw sendError(res, -31060, "Mahsulot uchun to'lov qilingan");
//     if (transaction.state === PaymeState.Pending)
//       throw sendError(res, -31050, "Mahsulot uchun to'lov kutilayapti");
//   }

//   const newTransaction = await Transaction({
//     id: id,
//     state: PaymeState.Pending,
//     amount,
//     user_id,
//     create_time: time,
//   });

//   await newTransaction.save();

//   return {
//     result: {
//       transaction: newTransaction.id,
//       state: PaymeState.Pending,
//       create_time: newTransaction.create_time,
//     },
//   };
// };

// const performTransaction = async (params, res) => {
//   try {
//     const currentTime = Date.now();

//     const transaction = await Transaction.findOne({ id: params.id });
//     if (!transaction) {
//       throw sendError(res, -31003, "Tranzaksiya topilmadi.");
//     }

//     if (transaction.state !== PaymeState.Pending) {
//       if (transaction.state !== PaymeState.Paid) {
//         throw sendError(
//           res,
//           -31008,
//           "Ushbu operatsiyani bajarish mumkin emas."
//         );
//       }
//       return {
//         result: {
//           state: transaction.state,
//           perform_time: transaction.perform_time,
//           transaction: transaction.id,
//         },
//       };
//     }

//     const timeDifference = (currentTime - transaction.create_time) / 60000;
//     const isExpired = timeDifference >= 12;

//     if (isExpired) {
//       await Transaction.findOneAndUpdate(
//         { id: transaction.id },
//         {
//           state: PaymeState.PendingCanceled,
//           reason: 4,
//           cancel_time: currentTime,
//         }
//       );
//       return sendError(res, -31008, "Ushbu operatsiyani bajarish mumkin emas."); // throw o'rniga return
//     }

//     const tData = await Transaction.findOneAndUpdate(
//       { id: params.id },
//       {
//         state: PaymeState.Paid,
//         perform_time: currentTime,
//       },
//       { new: true }
//     );
//     //////////////////////////
//     const wallet = await Wallet.findOne({ user_id });

//     const user = await User.findById(user_id);
//     user.balance=user.balance+wallet.amount
//     // { balance: wallet.amount },
//     // {
//     //   new: true,
//     // }

//     await user.save();
//     //////////////
//     return {
//       result: {
//         perform_time: currentTime,
//         transaction: transaction.id,
//         state: PaymeState.Paid,
//       },
//     };
//   } catch (error) {
//     console.log("errrrrrrrrrr", error);
//   }
// };

// const cancelTransaction = async (params, res) => {
//   const transaction = await Transaction.findOne({ id: params.id });
//   if (!transaction) {
//     return res, -31003, "Tranzaksiya topilmadi.";
//   }

//   const currentTime = Date.now();

//   if (transaction.state === PaymeState.Pending) {
//     await Transaction.findOneAndUpdate(
//       { id: params.id },
//       {
//         state: PaymeState.PendingCanceled,
//         cancel_time: currentTime,
//         reason: 3,
//       }
//     );
//     return {
//       result: {
//         state: PaymeState.PendingCanceled,
//         cancel_time: currentTime,
//         transaction: transaction.id,
//       },
//     };
//   }
//   if (transaction.state === PaymeState.Paid) {
//     throw sendError(
//       res,
//       -31007,
//       "To'langan tranzaktsiyani qaytarib bo'lmaydi."
//     );
//   }

//   return {
//     result: {
//       state: transaction.state,
//       cancel_time: transaction.cancel_time,
//       transaction: transaction.id,
//     },
//   };
// };

// const checkTransaction = async (params, res) => {
//   const transaction = await Transaction.findOne({ id: params.id });
//   if (!transaction) {
//     throw sendError(res, -31003, "Tranzaksiya topilmadi.");
//   }

//   return {
//     result: {
//       create_time: transaction.create_time,
//       perform_time: transaction.perform_time,
//       cancel_time: transaction.cancel_time,
//       transaction: transaction.id,
//       state: transaction.state,
//       reason: transaction.reason,
//     },
//   };
// };

const Transaction = require("../models/payme.transaction.model");
const { PaymeState } = require("../enums/PaymeState");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");

// const Course = require("../models/course.model");

// const StudentCourse = require("../models/studentCourse.model");
const sendError = (res, code, message) => {
  res.json({
    error: {
      code,
      message,
    },
  });
};

exports.payme = async (req, res, next) => {
  try {
    const { method, params } = req.body;

    switch (method) {
      case "CheckPerformTransaction": {
        console.log("sdfs 111");

        const result = await checkPerformTransaction(params, res);
        return res.json(result);
      }
      case "CreateTransaction": {
        console.log("sdf");

        const result = await createTransaction(params, res);
        return res.json(result);
      }
      case "PerformTransaction": {
        const result = await performTransaction(params, res);
        return res.json(result);
      }
      case "CheckTransaction": {
        const result = await checkTransaction(params, res);
        return res.json(result);
      }

      case "CancelTransaction": {
        const result = await cancelTransaction(params, res);
        return res.json(result);
      }
    }
  } catch (err) {
    next(err);
  }
};

const checkPerformTransaction = async (params, res) => {
  const {
    account: { user_id, course_id },
  } = params;
  let { amount } = params;
  amount = Math.floor(amount / 100);
  const payment = await Payment.findOne({ _id: course_id, user_id });
  if (!payment) {
    throw sendError(res, -31050, "Tranzaksiya topilmadi.");
  }

  if (amount !== payment.amount) {
    throw sendError(res, -31001, "Noto'g'ri summa.");
  }

  const user = await User.findById(user_id);
  if (!user) {
    throw sendError(res, -31050, "User topilmadi.");
  }

  return {
    result: {
      allow: true,
    },
  };
};

const createTransaction = async (params, res) => {
  try {
    const {
      id,
      account: { user_id, course_id },
      time,
    } = params;
    let { amount } = params;

    amount = Math.floor(amount / 100);

    let transaction = await Transaction.findOne({ id });

    if (transaction) {
      if (transaction.state !== PaymeState.Pending) {
        throw sendError(
          res,
          -31008,
          "Operatsiyani amalga oshirish mumkin emas."
        );
      }

      const currentTime = Date.now();

      const expirationTime = (currentTime - transaction.createdAt) / 60000 < 12;

      if (!expirationTime) {
        await Transaction.updateById(params.id, {
          state: PaymeState.PendingCanceled,
          reason: 4,
        });

        throw sendError(
          res,
          -31008,
          "Operatsiyani amalga oshirish mumkin emas."
        );
      }

      return {
        result: {
          transaction: transaction.id,
          state: transaction.state,
          create_time: transaction.create_time,
        },
      };
    }
    await checkPerformTransaction(params, res);

    transaction = await Transaction.findOne({
      user_id,
      payment_id: course_id,
    });
    if (transaction) {
      if (transaction.state === PaymeState.Paid)
        throw sendError(res, -31060, "Operatsiyani amalga oshirilgan");
      if (transaction.state === PaymeState.Pending)
        throw sendError(
          res,
          -31050,
          "Operatsiyani amalga oshirish kutilayapti"
        );
    }

    const newTransaction = await Transaction({
      id: id,
      state: PaymeState.Pending,
      amount,
      user_id,
      payment_id: course_id,
      create_time: time,
    });

    await newTransaction.save();

    return {
      result: {
        transaction: newTransaction.id,
        state: PaymeState.Pending,
        create_time: newTransaction.create_time,
      },
    };
  } catch (error) {
    console.log("sdfsdfsd", error);
  }
};

const performTransaction = async (params, res) => {
  try {
    const currentTime = Date.now();

    const transaction = await Transaction.findOne({ id: params.id });
    if (!transaction) {
      throw sendError(res, -31003, "Tranzaksiya topilmadi.");
    }

    if (transaction.state !== PaymeState.Pending) {
      if (transaction.state !== PaymeState.Paid) {
        throw sendError(
          res,
          -31008,
          "Ushbu operatsiyani bajarish mumkin emas."
        );
      }
      return {
        result: {
          state: transaction.state,
          perform_time: transaction.perform_time,
          transaction: transaction.id,
        },
      };
    }

    const timeDifference = (currentTime - transaction.create_time) / 60000;
    const isExpired = timeDifference >= 12;

    if (isExpired) {
      await Transaction.findOneAndUpdate(
        { id: transaction.id },
        {
          state: PaymeState.PendingCanceled,
          reason: 4,
          cancel_time: currentTime,
        }
      );
      return sendError(res, -31008, "Ushbu operatsiyani bajarish mumkin emas."); // throw o'rniga return
    }

    const tData = await Transaction.findOneAndUpdate(
      { id: params.id },
      {
        state: PaymeState.Paid,
        perform_time: currentTime,
      },
      { new: true }
    );
    //////////////
    const payment = await Payment.findOne({
      _id: tData.payment_id,
      user_id: tData.user_id,
    });
    payment.isCompleted = true;
    await payment.save();
    const user = await User.findById(tData.user_id);
    user.balance = user.balance + payment.amount;
    // const user = await User.updateById(user_id, { balance: tData.amount });
    user.save();
    //////////////
    return {
      result: {
        perform_time: currentTime,
        transaction: transaction.id,
        state: PaymeState.Paid,
      },
    };
  } catch (error) {
    console.log("errr", error);
  }
};

const cancelTransaction = async (params, res) => {
  const transaction = await Transaction.findOne({ id: params.id });
  if (!transaction) {
    return res, -31003, "Tranzaksiya topilmadi.";
  }

  const currentTime = Date.now();

  if (transaction.state === PaymeState.Pending) {
    await Transaction.findOneAndUpdate(
      { id: params.id },
      {
        state: PaymeState.PendingCanceled,
        cancel_time: currentTime,
        reason: 3,
      }
    );
    return {
      result: {
        state: PaymeState.PendingCanceled,
        cancel_time: currentTime,
        transaction: transaction.id,
      },
    };
  }
  if (transaction.state === PaymeState.Paid) {
    throw sendError(
      res,
      -31007,
      "To'langan tranzaktsiyani qaytarib bo'lmaydi."
    );
  }

  return {
    result: {
      state: transaction.state,
      cancel_time: transaction.cancel_time,
      transaction: transaction.id,
    },
  };
};

const checkTransaction = async (params, res) => {
  const transaction = await Transaction.findOne({ id: params.id });
  if (!transaction) {
    throw sendError(res, -31003, "Tranzaksiya topilmadi.");
  }

  return {
    result: {
      create_time: transaction.create_time,
      perform_time: transaction.perform_time,
      cancel_time: transaction.cancel_time,
      transaction: transaction.id,
      state: transaction.state,
      reason: transaction.reason,
    },
  };
};
