import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================
// Register
// ============================

export const registerUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.post("/register", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// Login
// ============================

export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/login", credentials);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// Logout
// ============================

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await API.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// Forgot Password
// ============================

export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/forgot-password", {
      email,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// Reset Password
// ============================

export const resetPassword = async (data) => {
  try {
    const response = await API.post("/reset-password", data);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// Current Logged User
// ============================

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await API.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await API.get("/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const updateProfile = async (profile) => {
  try {
    const response = await API.put("/profile", profile, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const changePassword = async (passwords) => {
  try {
    const response = await API.put("/profile/password", passwords, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDriverDashboardStats = async () => {
  try {
    const response = await API.get("/driver/dashboard-stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDriverScheduledJourneys = async () => {
  try {
    const response = await API.get("/driver/scheduled-journeys", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDriverTripHistory = async () => {
  try {
    const response = await API.get("/driver/trip-history", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const updateDriverJourneyStatus = async (journeyId, action) => {
  try {
    const response = await API.patch(`/driver/journeys/${journeyId}/status`, { action }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDriverAssignedVehicle = async () => {
  try {
    const response = await API.get("/driver/assigned-vehicle", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const createVehicleIssueReport = async (report) => {
  try {
    const response = await API.post("/driver/issue-reports", report, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getVehicleIssueReports = async () => {
  try {
    const response = await API.get("/issue-reports", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

// ============================
// Vehicle requests
// ============================

export const createVehicleRequest = async (requestData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await API.post("/vehicle-requests", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMyVehicleRequests = async () => {
  try {
    const response = await API.get("/vehicle-requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDepartmentVehicleRequests = async (status = "pending") => {
  try {
    const response = await API.get("/department/vehicle-requests", {
      params: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDepartmentVehicleRequest = async (requestId) => {
  try {
    const response = await API.get(
      `/department/vehicle-requests/${requestId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const submitRecommendation = async (requestId, recommendation) => {
  try {
    const response = await API.patch(
      `/department/vehicle-requests/${requestId}/recommendation`,
      recommendation,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getApprovalVehicleRequests = async (status = "pending") => {
  try {
    const response = await API.get("/approvals/vehicle-requests", {
      params: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getExecutiveStats = async () => {
  try {
    const response = await API.get("/dashboard/executive-stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getApprovalVehicleRequest = async (requestId) => {
  try {
    const response = await API.get(`/approvals/vehicle-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const allocateVehicleRequest = async (requestId, allocation) => {
  try {
    const response = await API.patch(
      `/approvals/vehicle-requests/${requestId}/allocate`,
      allocation,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDeputyPendingRecommendations = async () => {
  try {
    const response = await API.get("/approvals/recommendations", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const saveDeputyRecommendation = async (requestId, recommendation) => {
  try {
    const response = await API.patch(
      `/approvals/vehicle-requests/${requestId}/recommendation`,
      recommendation,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSeniorPendingRecommendations = async () => {
  try {
    const response = await API.get("/senior-recommendations/vehicle-requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSeniorRecommendationRequest = async (requestId) => {
  try {
    const response = await API.get(
      `/senior-recommendations/vehicle-requests/${requestId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const saveSeniorRecommendation = async (requestId, recommendation) => {
  try {
    const response = await API.patch(
      `/senior-recommendations/vehicle-requests/${requestId}`,
      recommendation,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMyVehicleRequest = async (requestId) => {
  try {
    const response = await API.get(`/vehicle-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFinalApprovalVehicleRequests = async (status = "pending") => {
  try {
    const response = await API.get("/final-approvals/vehicle-requests", {
      params: { status },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const finalApproveVehicleRequest = async (requestId) => {
  try {
    const response = await API.patch(
      `/final-approvals/vehicle-requests/${requestId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFinalApprovalVehicleRequest = async (requestId) => {
  try {
    const response = await API.get(
      `/final-approvals/vehicle-requests/${requestId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getApprovedJourneys = async () => {
  try {
    const response = await API.get("/approved-journeys", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicles = async (schedule = {}) => {
  try {
    const response = await API.get("/vehicles", {
      params: schedule,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicle = async (registrationNumber) => {
  try {
    const response = await API.get(
      `/vehicles/${encodeURIComponent(registrationNumber)}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicleById = async (vehicleId) => {
  try {
    const response = await API.get(
      `/vehicles/id/${encodeURIComponent(vehicleId)}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createVehicle = async (formData) => {
  try {
    const response = await API.post("/vehicles", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateVehicle = async (registrationNumber, formData) => {
  try {
    const response = await API.post(
      `/vehicles/${encodeURIComponent(registrationNumber)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDrivers = async (schedule = {}) => {
  try {
    const response = await API.get("/drivers", {
      params: schedule,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDriver = async (driverId) => {
  try {
    const response = await API.get(`/drivers/${encodeURIComponent(driverId)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createDriver = async (driver) => {
  try {
    const response = await API.post("/drivers", driver, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDriver = async (driverId, driver) => {
  try {
    const response = await API.put(
      `/drivers/${encodeURIComponent(driverId)}`,
      driver,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDriver = async (driverId) => {
  try {
    const response = await API.delete(
      `/drivers/${encodeURIComponent(driverId)}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
