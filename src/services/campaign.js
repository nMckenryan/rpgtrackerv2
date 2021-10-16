import http from "../http-common";

// ROUTING AUTOMATION THROUGH AXIOS

class CampaignDataService {
  getAll(page = 0) {
    return http.get(`?page=${page}`);
  }

  get(id) {
    return http.get(`/id/${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`?${by}=${query}&page=${page}`);
  }

  createSession(data) {
    return http.post("/session", data);
  }

  updateSession(data) {
    return http.put("/session", data);
  }

  deleteSession(id, userId) {
    return http.delete(`/session?id=${id}`, {
      data: { user_id: userId },
      // Get user ID for authenticating permissions
    });
  }

  getCuisines(id) {
    return http.get(`/cuisines`);
  }
}

export default new CampaignDataService();
