import CampaignsDAO from "../dao/campaignsDAO.js";

export default class CampaignsController {
  // GET DB
  static async apiGetCampaigns(req, res, next) {
    const campaignsPerPage = req.query.campaignsPerPage
      ? parseInt(req.query.campaignsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    // FILTER (shows at bottom of JSON request)
    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const { campaignsList, totalNumCampaigns } =
      await CampaignsDAO.getCampaigns({
        filters,
        page,
        campaignsPerPage,
      });

    // RESPONSE
    let response = {
      campaigns: campaignsList,
      page: page,
      filters: filters,
      entries_per_page: campaignsPerPage,
      total_results: totalNumCampaigns,
    };
    res.json(response);
  }

  // GET CAMPAIGN BY ID
  static async apiGetCampaignById(req, res, next) {
    try {
      let id = req.params.id || {};
      let campaign = await CampaignsDAO.getCampaignByID(id);
      if (!campaign) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(campaign);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  // GET CUSINE
  static async apiGetCampaignCuisines(req, res, next) {
    try {
      let cuisines = await CampaignsDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
