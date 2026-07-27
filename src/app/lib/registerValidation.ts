/**
 * Webinar registration form validation (name, email, contact number).
 */

export const REGISTER_LIMITS = {
  MAX_NAME: 100,
  MAX_EMAIL: 254,
  MAX_PHONE_DIGITS: 10,
  MIN_NAME: 3,
} as const;

/** At least 3 letters; allows spaces, hyphens, apostrophes, periods */
export const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{1,98}[A-Za-z.]$/;

export const EMAIL_PATTERN =
  /^[A-Za-z][A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export type RegisterFieldKey = "name" | "email" | "phone";
export type RegisterFieldErrors = Partial<Record<RegisterFieldKey, string>>;

export type RegisterFields = {
  name: string;
  email: string;
  phone: string;
};

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (
    trimmed.length < REGISTER_LIMITS.MIN_NAME ||
    trimmed.length > REGISTER_LIMITS.MAX_NAME
  ) {
    return false;
  }
  const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
  if (letterCount < REGISTER_LIMITS.MIN_NAME) return false;
  return NAME_PATTERN.test(trimmed);
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > REGISTER_LIMITS.MAX_EMAIL) return false;
  if (/^\d/.test(trimmed)) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const digits = getPhoneDigits(phone);
  return digits.length === REGISTER_LIMITS.MAX_PHONE_DIGITS;
}

export function validateRegisterFields(fields: RegisterFields): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const phone = fields.phone.trim();

  if (!name) {
    errors.name = "Full name is required.";
  } else if ((name.match(/[A-Za-z]/g) || []).length < REGISTER_LIMITS.MIN_NAME) {
    errors.name = "Name must be more than 2 letters.";
  } else if (!isValidName(name)) {
    errors.name = "Enter a valid name (letters only; more than 2 letters).";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (/^\d/.test(email)) {
    errors.email = "Email cannot start with a number.";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address (e.g. name@company.com).";
  }

  if (!phone) {
    errors.phone = "Contact number is required.";
  } else {
    const digits = getPhoneDigits(phone);
    if (digits.length > REGISTER_LIMITS.MAX_PHONE_DIGITS) {
      errors.phone = "Contact number cannot have more than 10 digits.";
    } else if (digits.length < REGISTER_LIMITS.MAX_PHONE_DIGITS) {
      errors.phone = "Enter a valid 10-digit contact number.";
    }
  }

  return errors;
}

export function validateRegisterField(
  field: RegisterFieldKey,
  value: string,
  options?: { requireFilled?: boolean }
): string | undefined {
  const requireFilled = options?.requireFilled ?? false;
  const trimmed = value.trim();

  if (!trimmed) {
    if (!requireFilled) return undefined;
    if (field === "name") return "Full name is required.";
    if (field === "email") return "Email address is required.";
    return "Contact number is required.";
  }

  if (field === "name") {
    if ((trimmed.match(/[A-Za-z]/g) || []).length < REGISTER_LIMITS.MIN_NAME) {
      return "Name must be more than 2 letters.";
    }
    if (!isValidName(trimmed)) {
      return "Enter a valid name (letters only; more than 2 letters).";
    }
    return undefined;
  }

  if (field === "email") {
    if (/^\d/.test(trimmed)) {
      return "Email cannot start with a number.";
    }
    if (!trimmed.includes("@") && trimmed.length < 3) return undefined;
    if (!isValidEmail(trimmed)) {
      return "Please enter a valid email address (e.g. name@company.com).";
    }
    return undefined;
  }

  const digits = getPhoneDigits(trimmed);
  if (digits.length > REGISTER_LIMITS.MAX_PHONE_DIGITS) {
    return "Contact number cannot have more than 10 digits.";
  }
  if (digits.length > 0 && digits.length < REGISTER_LIMITS.MAX_PHONE_DIGITS) {
    return "Enter a valid 10-digit contact number.";
  }
  return undefined;
}

export function firstRegisterError(errors: RegisterFieldErrors): string {
  return errors.name || errors.email || errors.phone || "";
}
