// lib/processFingerprintData.ts
import * as z from "zod";
import crypto from "crypto";

// 1. Schema definition
const fingerprintSchema = z.object({
  userAgent: z.string(),
  language: z.string(),
  platform: z.string(),
  screen: z.object({
    width: z.number(),
    height: z.number(),
    colorDepth: z.number(),
  }),
  timezone: z.string(),
  javaEnabled: z.boolean(),
  cookiesEnabled: z.boolean(),
  doNotTrack: z.union([z.string(), z.null()]),
  plugins: z.array(z.string()),
  webgl: z
    .object({
      renderer: z.string(),
      vendor: z.string(),
    })
    .nullable(),
  battery: z
    .object({
      level: z.number().min(0).max(1),
      charging: z.boolean(),
    })
    .nullable(),
});

// 2. Create SHA256 hash from selected parts
function createFingerprintHash(data: Record<string, any>): string {
  const jsonString = JSON.stringify(data);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

// 3. Trust score from 1 to 100
function calculateTrustScore(f: z.infer<typeof fingerprintSchema>): number {
  let score = 0;

  if (f.cookiesEnabled) score += 20;
  if (f.battery) score += 10;
  if (f.battery && typeof f.battery.level === "number" && f.battery.level > 0.3) score += 5;
  if (f.webgl) score += 15;
  if (f.plugins.length > 3) score += 10;
  if (f.doNotTrack === "1") score -= 10;
  if (f.platform.toLowerCase().includes("win")) score += 10;
  if (f.javaEnabled) score += 5;

  return Math.min(100, Math.max(1, score));
}

// 4. Metadata extractor
function extractMetadata(f: z.infer<typeof fingerprintSchema>) {
  return {
    platform: f.platform,
    language: f.language,
    screen: `${f.screen.width}x${f.screen.height}x${f.screen.colorDepth}`,
    timezone: f.timezone,
    battery: f.battery ?? null,
    webgl: f.webgl ?? null,
  };
}

// 5. Main helper function
export function processFingerprintData(input: unknown): {
  hash: string;
  trustScore: number;
  metadata: ReturnType<typeof extractMetadata>;
} | { error: string } {
  const result = fingerprintSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid fingerprint data" };
  }

  const f = result.data;
  const metadata = extractMetadata(f);
  const trustScore = calculateTrustScore(f);
  const hash = createFingerprintHash({
    ...metadata,
    userAgent: f.userAgent,
    doNotTrack: f.doNotTrack,
  });

  return { hash, trustScore, metadata };
}
