const {
  TransactionStatus,
  ClickAction,
  ClickError,
} = require("../configs/transaction");
const Course = require("../models/course.model");
const transactionModel = require("../models/transaction.model");
const User = require("../models/user.model");
const checkClickSignature = require("../utils/checkSignature");

const prepareTransaction = async (req, res, next) => {
  const {
    click_trans_id: transId,
    service_id: serviceId,
    merchant_trans_id: userId,
    course_id: course_id,
    amount,
    action,
    sign_time: signTime,
    sign_string: signString,
  } = req.body;

  const signatureData = {
    transId,
    serviceId,
    userId,
    amount,
    action,
    signTime,
  };
  let checkSignature = checkClickSignature(signatureData, signString);
  console.log("---c-spcsc", req.body, !checkSignature);

  if (!checkSignature) {
    res.status(400).json({
      error: ClickError.SignFailed,
      error_note: "Invalid sign",
    });
  }

  console.log(req.body, "--s-dsfsf", ClickAction.Prepare);
  if (parseInt(action) !== ClickAction.Prepare) {
    res.status(404).json({
      error: ClickError.ActionNotFound,
      error_note: "Action not found",
    });
  }

  const isAlreadyPaid = await transactionModel.findOne({
    userId,
    course_id,
    status: TransactionStatus.Paid,
  });
  if (isAlreadyPaid) {
    res.status(404).json({
      error: ClickError.AlreadyPaid,
      error_note: "Already paid",
    });
  }
  console.log(userId);

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({
      error: ClickError.UserNotFound,
      error_note: "User not found",
    });
  }

  const course = await Course.findById(course_id);
  if (!course) {
    res.status(404).json({
      error: ClickError.BadRequest,
      error_note: "Course not found",
    });
  }
  console.log(course);

  if (parseInt(amount) !== course.price) {
    res.status(404).json({
      error: ClickError.InvalidAmount,
      error_note: "Incorrect parameter amount",
    });
  }

  const transaction = await transactionModel.findOne({ transId });
  console.log(transId, "----transId", transaction);
  if (transaction && transaction.status === TransactionStatus.Canceled) {
    res.status(404).json({
      error: ClickError.TransactionCanceled,
      error_note: "Transaction canceled",
    });
  }

  const time = new Date().getTime();
  console.log(time);

  await transactionModel.create({
    id: transId,
    user_id: userId,
    course_id: course_id,
    status: TransactionStatus.Pending,
    create_time: time,
    amount,
    prepare_id: time,
  });

  res.status(200).json({
    click_trans_id: transId,
    merchant_trans_id: userId,
    merchant_prepare_id: time,
    error: ClickError.Success,
    error_note: "Success",
  });
};
const completeTransaction = async (req, res, next) => {
  const {
    click_trans_id: transId,
    service_id: serviceId,
    merchant_trans_id: userId,
    course_id: course_id,
    merchant_prepare_id: prepareId,
    amount,
    action,
    sign_time: signTime,
    sign_string: signString,
    error,
  } = req.body;

  const signatureData = {
    transId,
    serviceId,
    userId,
    prepareId,
    amount,
    action,
    signTime,
  };
  const checkSignature = checkClickSignature(signatureData, signString);
  if (!checkSignature) {
    return {
      error: ClickError.SignFailed,
      error_note: "Invalid sign",
    };
  }

  if (parseInt(action) !== ClickAction.Complete) {
    return {
      error: ClickError.ActionNotFound,
      error_note: "Action not found",
    };
  }
  const user = await User.findById(userId);
  if (!user) {
    return {
      error: ClickError.UserNotFound,
      error_note: "User not found",
    };
  }
  const course = await Course.findById(course_id);
  if (!course) {
    return {
      error: ClickError.BadRequest,
      error_note: "Product not found",
    };
  }

  const isPrepared = await transactionModel.findOne({
    prepare_id: prepareId,
  });
  if (!isPrepared) {
    return {
      error: ClickError.TransactionNotFound,
      error_note: "Transaction not found",
    };
  }
  const isAlreadyPaid = await transactionModel.findOne({
    userId,
    productId,
    status: TransactionStatus.Paid,
  });
  if (isAlreadyPaid) {
    return {
      error: ClickError.AlreadyPaid,
      error_note: "Already paid for course",
    };
  }
  if (parseInt(amount) !== course.price) {
    return {
      error: ClickError.InvalidAmount,
      error_note: "Incorrect parameter amount",
    };
  }
  const transaction = await transactionModel.findById(transId);
  if (transaction && transaction.status === TransactionStatus.Canceled) {
    return {
      error: ClickError.TransactionCanceled,
      error_note: "Transaction canceled",
    };
  }

  const time = new Date().getTime();
  if (error < 0) {
    await transactionModel.findByIdAndUpdate(transId, {
      status: TransactionStatus.Canceled,
      cancel_time: time,
    });

    return {
      error: ClickError.TransactionNotFound,
      error_note: "Transaction not found",
    };
  }
  await transactionModel.findByIdAndUpdate(transId, {
    status: TransactionStatus.Paid,
    perform_time: time,
  });
  return {
    click_trans_id: transId,
    merchant_trans_id: userId,
    merchant_confirm_id: time,
    error: ClickError.Success,
    error_note: "Success",
  };
};

module.exports = {
  prepareTransaction,
  completeTransaction,
};
