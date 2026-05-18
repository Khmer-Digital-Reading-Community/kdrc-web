export const validateRequired = (value: string, label: string): string => {
  if (!value || value.trim().length === 0) {
    return `${label} is required.`;
  }
  return '';
};

export const validateNameValue = (name: string): string => {
  const required = validateRequired(name, 'Name');
  if (required) return required;

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  return '';
};

export const validateEmailValue = (email: string): string => {
  const required = validateRequired(email, 'Email');
  if (required) return required;

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return isValid ? '' : 'Enter a valid email address.';
};

export const validatePasswordValue = (password: string): string => {
  const required = validateRequired(password, 'Password');
  if (required) return required;

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return '';
};

export const validateConfirmPasswordValue = (
  confirmPassword: string,
  password: string,
): string => {
  const required = validateRequired(confirmPassword, 'Please confirm your password');
  if (required) {
    return 'Please confirm your password.';
  }

  if (confirmPassword !== password) {
    return 'Passwords do not match.';
  }

  return '';
};
