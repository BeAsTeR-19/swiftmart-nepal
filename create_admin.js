const apiKey = "AIzaSyAEL58j-iLYUWvDdFb7J2euZ2Yk7GTMphc";
const email = "admin@swiftmart.com";
const password = "taylorswift";

async function createUser() {
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const data = await response.json();
  if (data.error) {
    console.log("Error creating user (might already exist):", data.error.message);
  } else {
    console.log("Admin user created successfully! UID:", data.localId);
  }
}
createUser();
