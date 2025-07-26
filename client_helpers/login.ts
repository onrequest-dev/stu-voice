export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || "Something went wrong",
      };
    }

    return {
      success: true,
      message: result.message || "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
}
