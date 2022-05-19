const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        mongodb_username: "cturgeon",
        mongodb_password: "NgVzQdYr4CtZ7trk",
        mongodb_clustername: "cluster0",
        mongodb_database: "api-data",
      },
    };
  }
};
