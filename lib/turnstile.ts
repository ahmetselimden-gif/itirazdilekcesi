type TurnstileValidationResult = {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  action?: string;
};

export function isTurnstileEnabled() {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

export async function validateTurnstileToken(token: string, remoteip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { success: true } as TurnstileValidationResult;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (remoteip) {
    formData.append("remoteip", remoteip);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        cache: "no-store",
      }
    );

    return (await response.json()) as TurnstileValidationResult;
  } catch {
    return {
      success: false,
      "error-codes": ["internal-error"],
    } satisfies TurnstileValidationResult;
  }
}
