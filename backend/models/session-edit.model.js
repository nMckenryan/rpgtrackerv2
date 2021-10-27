// WEBHOOK MODEL FOR EDITING IN MONGODB REALM (code stored as archive, .)

exports = async function (payload, response) {
  if (payload.body) {
    const body = EJSON.parse(payload.body.text());
    const sessions = context.services
      .get("mongodb-atlas")
      .db("sample_restaurants")
      .collection("sessions");
    const date = new Date();

    const updateResponse = await sessions.updateOne(
      { user_id: body.user_id, _id: BSON.ObjectId(body.session_id) },
      { $set: { text: body.text, date: date } }
    );

    return updateResponse;
  }

  return {};
};
