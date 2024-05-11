const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
//import apiRotes and ejsRoutes
const apiRoutes = require("./routes/apiRoutes");
//const ejsRoutes = require("./routes/ejsRoutes");

app.prepare().then(() => {
  const server = express();
  // To use nodeadmin correctly:
  // It's crucial to pass the Express `server` instance to nodeadmin, not the Next.js `app`
  // This ensures that nodeadmin middleware is applied to the Express server instance
  server.use(require("nodeadmin")(server));

  //; --------------------
  // Define custom Express routes here, e.g.:
  // server.get('/custom-route', (req, res) => res.send('Hello World!'));

  // Next.js page routing:

  // Define your API routes under /api
  server.get("/hello", (req, res) => {
    res.send("hello");
  });
  server.use("/api", apiRoutes);

  // Define your EJS routes under /ejs
  //server.use("/ejs", require("./ejsRoutes"));

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
