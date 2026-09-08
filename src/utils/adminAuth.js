const API_URL = "http://localhost:5001";

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
}

export async function verifyAdmin() {
  const token = getAdminToken();

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/api/admin/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logoutAdmin();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
