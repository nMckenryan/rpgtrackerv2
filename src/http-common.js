import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:5000/api/v1/campaigns/",
  baseURL:
    "https://ap-southeast-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/rpg-tracker-zugah/service/rpgtrackerservice/incoming_webhook/",
  headers: {
    "Content-type": "application/json",
  },
});
