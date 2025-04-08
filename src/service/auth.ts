import api from "@/lib/api";

async function isUsernameAvailable(username: string) {
  if (!username) {
    return null;
  }
  const encodedUsername = encodeURIComponent(username);
  try {
    // this API endpoint does not need auth, so we can use 'ky' or 'api'
    const response = await api(`user/usertag-available/${encodedUsername}`, {
      parseJson: (text) => text, // needed, else we see [SyntaxError: JSON Parse error: Unexpected end of input]
      throwHttpErrors: false,
    });
    if (response.status === 200) {
      return true;
    }
    if (response.status === 400) {
      return false;
    }
    if (!response.ok) {
      throw new Error("Failed to check username availability");
    }
    return false;
  } catch (error) {
    console.error("[isUsernameAvailable] Unknown error:", error);
    return false;
  }
}

export { isUsernameAvailable };
