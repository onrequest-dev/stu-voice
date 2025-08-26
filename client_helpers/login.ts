import {  UserInfo } from "@/types/types";

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

    const userInfo:UserInfo = {
      id:result.username ,
      fullName: result.fullname,
      gender:result.gender ,
      education:{
        level: result.level,
          grade:result.info.grade ,
          track: "",
          degreeSeeking: result.info.degreeSeeking,
          university: result.university, 
          faculty: result.faculty, 
          specialization: result.info.specialization,
          year:result.info.year ,
          studentId: result.info.studentId ,
          icon: result.icon
      }
    };
    console.log(userInfo)
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('votes', JSON.stringify(result.voteshistory));
      localStorage.setItem('permenet_reactions', JSON.stringify(result.reactionshistory));

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