exports.getDaate = function () {
  const option = { weekday: "long", day: "numeric", month: "long" };
  let today = new Date();

  var day = today.toLocaleDateString("en-US", option);
  return day;
};
exports.getDay = function () {
  const option = { weekday: "long" };
  let today = new Date();

  var day = today.toLocaleDateString("en-US", option);
  return day;
};
