import express from "express";
import CampaignCtrl from "./campaigns.controller.js";
import SessionCtrl from "./sessions.controller.js";
const router = express.Router();

router.route("/").get(CampaignCtrl.apiGetCampaigns);
router.route("/id/:id").get(CampaignCtrl.apiGetCampaignById);
router.route("/cuisines").get(CampaignCtrl.apiGetCampaignCuisines);

router
  .route("/session")
  .post(SessionCtrl.apiPostSession)
  .put(SessionCtrl.apiUpdateSession)
  .delete(SessionCtrl.apiDeleteSession);

export default router;
