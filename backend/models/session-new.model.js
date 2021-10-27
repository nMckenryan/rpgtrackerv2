exports = async function (payload, response) {
  if (payload.body) {
    const body = EJSON.parse(payload.body.text());
    const sessions = context.services
      .get("mongodb-atlas")
      .db("dungeontracker")
      .collection("sessions");

    const sessionDoc = {
      char_name: body.char_name,
      user_id: body.user_id,
      session_date: body.session_date,
      session_log: body.session_log,
      level: body.char_level,
      campaign_id: BSON.ObjectId(body.campaign_id),
    };

    return await sessions.insertOne(sessionDoc);
  }

  return {};
};
