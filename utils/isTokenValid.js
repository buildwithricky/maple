import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

const isTokenValid = (token)=>{
// Decode the token without verifying its signature (just to access its payload)
const decodedToken = jwtDecode(token);
// Check if the token has an 'exp' field
if (decodedToken && decodedToken.exp) {
  // Convert the 'exp' (which is in seconds) to a JavaScript Date object
  const expirationDate = new Date(decodedToken.exp * 1000);
  if(expirationDate.getMilliseconds() > Date.now()){
    console.log("Token expired")
    return false
  }
  console.log(`Token expires at: ${expirationDate}`);
  return true
} else {
  console.log('Expiration time (exp) not found in the token.');
}
}

jwtDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjRhMzJjMzE3NmViMTdhN2UzN2YyNyIsImlhdCI6MTcyODY4NTM0MywiZXhwIjoxNzI5ODk0OTQzfQ.9WhsdgqtpJ1MXKuOuOUIW8tXQkHLJ0NEMzWSkt1VhKI"); // Extract
export default isTokenValid