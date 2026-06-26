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