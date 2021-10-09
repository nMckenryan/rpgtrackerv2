import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

let sessions;

export default class SessionsDAO {
  // CREATE/FIND DB
  static async injectDB(conn) {
    if (sessions) {
      return;
    }
    try {
      sessions = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("sessions");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  // ADD
  static async addSession(campaignID, character, sesLog, date) {
    try {
      const sessionDoc = {
        name: character.name,
        user_id: character._id,
        date: date,
        text: sesLog,
        campaign_ID: ObjectId(campaignID),
      };

      return await sessions.insertOne(sessionDoc);
    } catch (e) {
      console.error(`Unable to post session: ${e}`);
      return { error: e };
    }
  }

  // UPDATE
  // TODO: (only updates if updated by same user, implement Campaign instead of User?)
  // TODO: FIND WHY THIS ISNT WORKING WHILE THE OTHERS ARE
  static async updateSession(sessionId, userId, text, date) {
    try {
      const updateResponse = await sessions.updateOne(
        { user_id: userId, _id: ObjectId(sessionId) },
        { $set: { text: text, date: date } }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update session: ${e}`);
      return { error: e };
    }
  }

  // DELETE
  static async deleteSession(sessionId, userId) {
    try {
      const deleteResponse = await sessions.deleteOne({
        _id: ObjectId(sessionId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete session: ${e}`);
      return { error: e };
    }
  }
}
