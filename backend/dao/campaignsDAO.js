import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;
let campaigns;

export default class CampaignsDAO {
  // CONNECTION (Mongodb will create DB if not found)
  static async injectDB(conn) {
    if (campaigns) {
      return;
    }
    try {
      campaigns = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in campaignsDAO: ${e}`
      );
    }
  }

  // GET CAMPAIGNS
  static async getCampaigns({
    filters = null,
    page = 0,
    campaignsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      cursor = await campaigns.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { campaignsList: [], totalNumCampaigns: 0 };
    }

    const displayCursor = cursor
      .limit(campaignsPerPage)
      .skip(campaignsPerPage * page);

    try {
      const campaignsList = await displayCursor.toArray();
      const totalNumCampaigns = await campaigns.countDocuments(query);

      return { campaignsList, totalNumCampaigns };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { campaignsList: [], totalNumCampaigns: 0 };
    }
  }

  // GET BY ID
  static async getCampaignByID(id) {
    try {
      // Pipeline to match collections w/ relationships together (like GraphQL)
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          // Finding Sessions to attach to Campaigns
          $lookup: {
            from: "sessions",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$campaign_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "sessions",
          },
        },
        {
          $addFields: {
            sessions: "$sessions",
          },
        },
      ];
      return await campaigns.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getCampaignByID: ${e}`);
      throw e;
    }
  }

  // GET CUISINES
  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await campaigns.distinct("cuisine"); //returns 'set' of cuisines
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
