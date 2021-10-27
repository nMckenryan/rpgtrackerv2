import SessionsDAO from "../dao/sessionsDAO.js";

export default class SessionsController {
  // CREATE SESSION
  static async apiPostSession(req, res, next) {
    try {
      const campaignId = req.body.campaign_id;
      const session = req.body.text;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
        level: parseInt(req.body.level),
      };
      const date = new Date();

      const SessionResponse = await SessionsDAO.addSession(
        campaignId,
        userInfo,
        session,
        date
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  //   UPDATE
  static async apiUpdateSession(req, res, next) {
    try {
      const sessionId = req.body.session_id;
      const text = req.body.text;
      const level = parseInt(req.body.level);
      const date = new Date();

      const sessionResponse = await SessionsDAO.updateSession(
        sessionId,
        req.body.user_id,
        text,
        level,
        date
      );

      var { error } = sessionResponse;
      if (error) {
        res.status(400).json({ error });
      }

      console.log(sessionResponse);

      if (sessionResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update Session from Controller - User may not be original poster. Ensure session_id matches _id in mongodb"
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  //   DELETE
  static async apiDeleteSession(req, res, next) {
    try {
      const sessionId = req.query.id;
      const userId = req.body.user_id;
      const sessionResponse = await SessionsDAO.deleteSession(
        sessionId,
        userId
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
