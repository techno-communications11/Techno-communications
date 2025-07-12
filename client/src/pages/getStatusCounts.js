import api from "../api/axios";
const getStatusCounts = async () => {
  try {
    const response = await api.get("/status");

    if (response.status === 200) {
      return response.data; // Return the data if the request is successful
    }

    throw new Error("Unexpected response status"); // Throw an error for unexpected status
  } catch (error) {
    console.error("Error fetching status counts:", error); // Log the error for debugging
    throw error; // Rethrow the error for higher-level handling
  }
};

export default getStatusCounts;
