/*
 * Fixes escape strings
 * @param {string} ltrString - the letter string
 */
exports.fix = ltrString => {
  // Backslash should be escaped like this for whatever reason
  ltrString = /\\/.test(ltrString) ? "\\\\\\\\" : ltrString;
  // GRAVE ACCENT
  ltrString = /\u0060/.test(ltrString) ? `\\\`` : ltrString;
  // QUOTATION MARK
  ltrString = /\u0022/.test(ltrString) ? `\\\"` : ltrString;
  return ltrString;
};
