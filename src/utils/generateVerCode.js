const generateVerificationCode = async () => {
  return {
    // code: Math.floor(100000 + Math.random() * 900000).toString(),
    code: 123456,
    expires: new Date(Date.now() + 2 * 60 * 1000),
  };
};

module.exports = {generateVerificationCode};
