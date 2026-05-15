export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const linkedInRegex =
  /^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/|lnkd\.in\/)[a-zA-Z0-9-]{3,30}\/?$/;

export const usernameRegex = /^(?!.*[&%:;*|></\\#?"=])[^\s]{6,30}$/;

// Twitter OAuth never gives us the user's real email — Strapi assigns a
// synthetic `twitter_{id}@users.noreply.keepsimple.io` placeholder. The
// settings UI offers a one-time email-change flow only while that placeholder
// is still in use. The backend enforces the same check.
const twitterPlaceholderEmailRegex =
  /^twitter_[^@]+@users\.noreply\.keepsimple\.io$/i;

export const isTwitterPlaceholderEmail = (email?: string | null): boolean =>
  !!email && twitterPlaceholderEmailRegex.test(email);
