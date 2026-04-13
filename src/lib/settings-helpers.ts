export const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const linkedInRegex =
  /^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/|lnkd\.in\/)[a-zA-Z0-9-]{3,30}\/?$/;

export const usernameRegex = /^(?!.*[&%:;*|></\\#?"=])[^\s]{6,30}$/;
