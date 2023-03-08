const bcryptOptions = {
  field: "password",
  rounds: 12,
  compare: "authenticate",
};

module.exports = bcryptOptions;
