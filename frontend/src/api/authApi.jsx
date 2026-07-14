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
    const response = await API.post(
      "/register",
      userData
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message
    );
  }
};

// ============================
// Login
// ============================

export const loginUser = async (credentials) => {
  try {
    const response = await API.post(
      "/login",
      credentials
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message
    );
  }
};

// ============================
// Logout
// ============================

export const logoutUser = async () => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await API.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message
    );
  }
};

// ============================
// Forgot Password
// ============================

export const forgotPassword = async (
  email
) => {
  try {
    const response = await API.post(
      "/forgot-password",
      {
        email,
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message
    );
  }
};

// ============================
// Reset Password
// ============================

export const resetPassword = async (
  data
) => {
  try {
    const response = await API.post(
      "/reset-password",
      data
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message
    );
  }
};

// ============================
// Current Logged User
// ============================

export const getCurrentUser =
  async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await API.get(
        "/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw (
        error.response?.data ||
        error.message
      );
    }
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

export const getDepartmentVehicleRequests = async () => {
  try {
    const response = await API.get("/department/vehicle-requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDepartmentVehicleRequest = async (requestId) => {
  try {
    const response = await API.get(`/department/vehicle-requests/${requestId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const submitRecommendation = async (requestId, recommendation) => {
  try {
    const response = await API.patch(`/department/vehicle-requests/${requestId}/recommendation`, recommendation, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicles = async () => {
  try {
    const response = await API.get("/vehicles", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getVehicle = async (registrationNumber) => {
  try {
    const response = await API.get(`/vehicles/${encodeURIComponent(registrationNumber)}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const createVehicle = async (formData) => {
  try {
    const response = await API.post("/vehicles", formData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const updateVehicle = async (registrationNumber, formData) => {
  try {
    const response = await API.post(`/vehicles/${encodeURIComponent(registrationNumber)}`, formData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDrivers = async () => {
  try {
    const response = await API.get("/drivers", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const getDriver = async (driverId) => {
  try {
    const response = await API.get(`/drivers/${encodeURIComponent(driverId)}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const createDriver = async (driver) => {
  try {
    const response = await API.post("/drivers", driver, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};

export const updateDriver = async (driverId, driver) => {
  try {
    const response = await API.put(`/drivers/${encodeURIComponent(driverId)}`, driver, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    return response.data;
  } catch (error) { throw error.response?.data || error.message; }
};
