//setup express
const express = require('express');
const app = express();

//middleware
app.use(express.text());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
  
});


// routes
app.use(express.static("www"));

const metadataRoutes = require('./routes/metadata-routes');
app.use("/metadata", metadataRoutes);
// const metadataRoutes2 = require('./routes/metadata-routes-beta');
// app.use("/metadata2", metadataRoutes2);

const galleryRoutes = require('./routes/gallery-routes');
app.use("/gallery", galleryRoutes);

const gameRoutes = require('./routes/game-routes');
app.use("/play", gameRoutes);

//serve
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}!`),
);