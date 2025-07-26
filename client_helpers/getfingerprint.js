export async function getClientFingerprint() {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    javaEnabled: navigator.javaEnabled(),
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    plugins: Array.from(navigator.plugins, (p) => p.name),
    webgl: getWebGLInfo(),
    battery: null,
  };

  // محاولة الحصول على معلومات البطارية إن توفرت
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      fingerprint.battery = {
        level: battery.level,
        charging: battery.charging,
      };
    } catch (e) {
      fingerprint.battery = { error: "Battery info not accessible" };
    }
  }

  return fingerprint;
}

// دالة مساعدة للحصول على معلومات WebGL
function getWebGLInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return null;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown",
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown",
    };
  } catch {
    return null;
  }
}
