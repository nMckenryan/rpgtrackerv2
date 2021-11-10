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
    console.log("QUERY" + query + "NAME" + by);
    return http.get(`rpgtrackerhook?${by}=${query}&page=${page}`);
  }

  // CRUD Actions for Campaign/Session. "type" argument determines path used
  createRecord(data, type) {
    return http.post(`/${type}-new`, data);
  }

  updateRecord(data, type) {
    return http.put(`/${type}-edit`, data);
  }

  deleteRecord(id, userId, type) {
    console.log(type)
    return http.delete(`/${type}-delete?id=${id}`, {
      data: { user_id: userId },
      // Get user ID for authenticating permissions
    });
  }

  getSystems(id) {
    return http.get(`/systems`);
  }
}

export default new CampaignDataService();
