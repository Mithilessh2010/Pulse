type VerificationEmailResult = {
  sent: boolean;
};

export function canSendVerificationEmail() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendVerificationEmail(email: string, code: string): Promise<VerificationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Pulse <onboarding@resend.dev>";

  if (!canSendVerificationEmail() || !apiKey) {
    return { sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Your Pulse verification code",
      text: `Your Pulse verification code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="background:#07090F;color:#F0F2F8;font-family:Inter,Arial,sans-serif;padding:32px">
          <div style="max-width:520px;margin:0 auto;border:1px solid rgba(255,255,255,0.1);border-radius:16px;background:#0C1220;padding:28px">
            <p style="color:#00B4D8;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 16px">Pulse verification</p>
            <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Verify your email</h1>
            <p style="color:#9BA8C7;line-height:1.6;margin:0 0 24px">Enter this code to finish setting up your Pulse workspace. It expires in 10 minutes.</p>
            <div style="font-size:32px;letter-spacing:0.24em;font-weight:700;color:#FFFFFF;background:#111827;border-radius:12px;padding:18px 22px;text-align:center">${code}</div>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[Pulse auth] Verification email failed", detail);
    return { sent: false };
  }

  return { sent: true };
}
