import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import CampaignsDAO from "./dao/campaignsDAO.js";
import SessionsDAO from "./dao/sessionsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.REACT_APP_CAMPDB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .then(async (client) => {
    await CampaignsDAO.injectDB(client);
    await SessionsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on Port: ${port}`);
    });
  });
