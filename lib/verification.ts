import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";
import { getVerificationCodesCollection } from "@/lib/mongodb";

const CODE_TTL_MINUTES = 10;
const CODE_HASH_ROUNDS = 10;

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveVerificationCode(email: string, code: string) {
  const codes = await getVerificationCodesCollection();
  const now = new Date();
  const codeHash = await bcrypt.hash(code, CODE_HASH_ROUNDS);

  await codes.updateOne(
    { email },
    {
      $set: {
        email,
        codeHash,
        expiresAt: new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000),
        attempts: 0,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function createVerificationCode(email: string) {
  const code = generateVerificationCode();
  await saveVerificationCode(email, code);
  const emailResult = await sendVerificationEmail(email, code);

  if (!emailResult.sent && process.env.NODE_ENV !== "production") {
    console.log(`[Pulse auth] Verification code for ${email}: ${code}`);
  }

  return code;
}

export function compareVerificationCode(code: string, codeHash: string) {
  return bcrypt.compare(code, codeHash);
}
