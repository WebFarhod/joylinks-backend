const convertToSeconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

module.exports = { convertToSeconds };
