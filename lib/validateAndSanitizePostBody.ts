import { z, ZodType } from "zod";
import sanitizeHtml from "sanitize-html";

// تنظيف القيم النصية باستخدام sanitize-html
function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return sanitizeHtml(input, {
      allowedTags: [], // يمنع جميع الوسوم
      allowedAttributes: {}, // يمنع جميع الصفات
    });
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  } else if (typeof input === "object" && input !== null) {
    const sanitizedObj: any = {};
    for (const key in input) {
      sanitizedObj[key] = sanitizeInput(input[key]);
    }
    return sanitizedObj;
  } else {
    return input;
  }
}

// دالة عامة: تأخذ schema كوسيلة تحقق
export function validateAndSanitize<T>(schema: ZodType<T>, body: any) {
  const sanitizedBody = sanitizeInput(body);
  const result = schema.safeParse(sanitizedBody);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: result.data as T,
  };
}
