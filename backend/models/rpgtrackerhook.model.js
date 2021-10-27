// MONGODB REALM WEBHOOK MODEL FOR GETTING COLLECTION, FILTERS (code stored as archive, .)

// This function is the webhook's request handler.
exports = async function (payload, response) {
  // COPIED FROM CAMPAIGNS.CONTROLLER.js AND MODIFIED
  // Default page 0, default campaigns per page is 20
  const { campaignsPerPage = 20, page = 0 } = payload.query;

  // FILTER (shows at bottom of JSON request). translated from Campaigns.DAO
  let query = {};
  if (payload.query.gamemaster) {
    query = { gamemaster: { $eq: payload.query.gamemaster } };
  } else if (payload.query.zipcode) {
    query = { "address.isRunning": { $eq: payload.query.isRunning } };
  }
  // TEXT SEARCH USES INDEX
  // } else if (payload.query.name) {
  //   query = { $text: {$search: payload.query.name } }
  // }

  const collection = context.services
    .get("mongodb-atlas")
    .db("dungeontracker")
    .collection("campaigns");
  let campaignsList = await collection
    .find(query)
    .skip(page * campaignsPerPage)
    .limit(campaignsPerPage)
    .toArray();

  // All responses are Objects, need to be returned as Strings instead of IDs
  campaignsList.forEach((camp) => {
    camp._id = camp._id.toString();
  });

  // RESPONSE
  let responseData = {
    campaigns: campaignsList,
    page: page.toString(),
    filters: {}, //filter not used in frontend. no need to return
    entries_per_page: campaignsPerPage.toString(),
    total_results: await collection.count(query).then((num) => num.toString()),
  };

  return responseData;
};
