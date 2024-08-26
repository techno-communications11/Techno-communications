import {jwtDecode} from 'jwt-decode';

const decodeToken = () => {
  try {
    const token = localStorage.getItem('token');
    
    // If token is not found, return null or empty object
    if (!token) return null;

    // Decode the token
    const decodedToken = jwtDecode(token);

    // Extract relevant information (e.g., name, id, role)
    const { name, id, role } = decodedToken;

    // Return the extracted information as an object
    return { name, id, role };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null; // Return null or handle error as needed
  }
};

export default decodeToken;
