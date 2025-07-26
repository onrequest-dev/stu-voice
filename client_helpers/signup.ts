type SignupResponse = {
  success: boolean;
  message: string;
};

export async function signupUser(
  username: string,
  password: string,
  fingerprint?: object
): Promise<SignupResponse> {
  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, fingerprint }),
    });

    const data = await response.json();

    if (response.ok) {
      // نجاح التسجيل
      return { success: true, message: data.message || 'User created successfully' };
    } else {
      // فشل التسجيل مع رسالة خطأ
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error: any) {
    // خطأ في الشبكة أو غير متوقع
    return { success: false, message: error.message || 'Network error' };
  }
}
