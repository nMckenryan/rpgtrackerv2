// MONGODB REALM WEBHOOK MODEL FOR GETTING CAMPAIGN BY ID (code stored as archive, .)

// This function is the webhook's request handler.
exports = async function (payload, response) {
  const id = payload.query.id || "";

  const campaigns = context.services
    .get("mongodb-atlas")
    .db("dungeontracker")
    .collection("campaigns");

  const pipeline = [
    {
      $match: {
        _id: BSON.ObjectId(id),
      },
    },
    {
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

  restaurant = await campaigns.aggregate(pipeline).next();
  restaurant._id = restaurant._id.toString();

  restaurant.sessions.forEach((session) => {
    session.date = new Date(session.date).toString();
    session._id = session._id.toString();
  });
  return restaurant;
};
