// utils/sanitizeAndValidate.ts
import { ZodSchema, ZodError } from "zod";

// دالة تعقيم بسيطة (كما في السابق)
function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input
      .trim()
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/[<>]/g, "")
      .replace(/['";]/g, "")
      .replace(/--/g, "");
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

// الدالة الرئيسية: تعقيم ثم التحقق من الشكل
export function sanitizeAndValidateInput<T>(
  input: any,
  schema: ZodSchema<T>
): { data: T | null; error: string | null } {
  try {
    const sanitized = sanitizeInput(input);
    const parsed = schema.parse(sanitized);
    return { data: parsed, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        data: null,
        error: err.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; "),
      };
    }
    return { data: null, error: "Unknown error during input validation." };
  }
}
