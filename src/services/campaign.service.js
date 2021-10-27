import http from "../http-common";

// ROUTING AUTOMATION THROUGH AXIOS

class CampaignDataService {
  getAll(page = 0) {
    // Prefixed with HOOK Name not COLLECTION Name
    return http.get(`rpgtrackerhook?page=${page}`);
  }

  get(id) {
    return http.get(`campaign?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`rpgtrackerhook?${by}=${query}&page=${page}`);
  }

  createSession(data) {
    return http.post("/session-new", data);
  }

  createCampaign(data) {
    return http.post("/campaign-new", data);
  }

  updateSession(data) {
    return http.put("/session-edit", data);
  }

  deleteSession(id, userId) {
    return http.delete(`/session-delete?id=${id}`, {
      data: { user_id: userId },
      // Get user ID for authenticating permissions
    });
  }

  getCuisines(id) {
    return http.get(`/cuisines`);
  }
}

export default new CampaignDataService();
