// app.ci.js
require("regenerator-runtime/runtime"); // for async/await in node_modules
const app = require("mock-user-auth/app").default || require("mock-user-auth/app");
const http = require("http");

// Add a simple GET route for root
app.get("/", (req, res) => {
  res.status(200).send("Server is running 🚀");
});

// Make all HEAD requests succeed (needed for start-server-and-test health check)
app.head("*", (req, res) => res.status(200).end());

// Optional: wrap original error handler to log and prevent crashes during HEAD
app.use((err, req, res, next) => {
  console.error("Error caught by app.ci.js middleware:", err.message);
  if (req.method === "HEAD") {
    res.status(200).end();
  } else {
    next(err);
  }
});

// create HTTP server
const server = http.createServer(app);

// listen on port 3000
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
