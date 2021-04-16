// this is the function which will be used in almost all async functions so that their is not need of try catch
module.exports = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};
