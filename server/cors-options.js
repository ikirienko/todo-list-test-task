const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://todo-list-test-task-production.up.railway.app",
  "https://todo-list-test-task-production-f900.up.railway.app",
  "https://todo-list-test-task-lake.vercel.app",
  "https://todo-list-test-task-lake.vercel.app/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,

  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
