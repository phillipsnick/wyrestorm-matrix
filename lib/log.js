/**
 * Basic logging function when in debug mode
 *
 * @param   string  message
 */
module.exports = function(message) {
  var date = new Date();
  var dateStr = date.getDate() + '/';
  dateStr += (date.getMonth() + 1) + '/';
  dateStr += (date.getFullYear()) + ' ';
  dateStr += date.getHours() + ':';
  dateStr += date.getMinutes() + ':';
  dateStr += date.getSeconds();

  console.log(dateStr, message);
}