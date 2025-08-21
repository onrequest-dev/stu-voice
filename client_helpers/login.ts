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

    // تخزين معلومات المستخدم في التخزين المحلي عند نجاح تسجيل الدخول
    const userInfo = {
      id: username,
      fullName: '',
      gender: 'male' as const,
      education: {
        university: '',
        faculty: '',
        department: '',
        level: ''
      }
    };
    console.table(result.icon)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
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