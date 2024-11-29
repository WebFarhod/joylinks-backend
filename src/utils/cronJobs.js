// const cron = require("cron");

const cron = require("node-cron");
const processMonthlyPayments = require("./processMonthlyPayments");

function scheduleCronJobs() {
//   cron.schedule("0 0 1 * *", async () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Monthly payment processing started...");
    try {
      await processMonthlyPayments();
      console.log("Monthly payments processed successfully.");
    } catch (error) {
      console.error("Error in processing monthly payments:", error);
    }
  });

  console.log("Cron jobs scheduled.");
}

module.exports = { scheduleCronJobs };
