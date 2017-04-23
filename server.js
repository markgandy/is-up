const micro = require("micro");

exports.startServer = () => {
  const server = micro(() => {
    return "Healthy!";
  });
  const port = 3150;
  server.listen(port, () => console.log(`Server is running on port ${port}`));
};
