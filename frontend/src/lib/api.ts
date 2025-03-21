import axios from "axios";

// Define the base API URL
const BASE_URL = "http://127.0.0.1:8000";

// Reusable API request function
export const apiRequest = async (method: string, endpoint: string, data?: any) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      headers: method !== "GET" ? { "Content-Type": "application/json" } : undefined,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};

// Specific API methods
export const uploadFile = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData,"form")
  return apiRequest("POST", "/upload-pdf/", file);
};

export const getFiles = async () => apiRequest("GET", "/files/");
export const deleteFile = async (fileId: string) => apiRequest("DELETE", `/files/${fileId}/`);
export const updateFile = async (fileId: string, data: any) => apiRequest("PATCH", `/files/${fileId}/`, data);
