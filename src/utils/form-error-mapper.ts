export type FormErrorRecord = Record<string, string>;

type ParseApiErrorFn = (error: unknown, fallback: string) => string;

export const clearFormErrors = (
  errors: FormErrorRecord,
  keys: string[],
): void => {
  for (const key of keys) {
    if (key in errors) {
      errors[key] = '';
    }
  }
};

export const mapApiErrorToForm = (
  error: unknown,
  errors: FormErrorRecord,
  fieldKeys: string[],
  fallbackMessage: string,
  parseApiError: ParseApiErrorFn,
): void => {
  clearFormErrors(errors, [...fieldKeys, 'form']);

  const anyErr = error as any;
  const apiPayload = anyErr?.response?.data;
  const nested = apiPayload && typeof apiPayload === 'object' ? apiPayload.data : null;

  if (nested?.errors) {
    const nestedErrors = nested.errors;

    if (Array.isArray(nestedErrors)) {
      errors.form = nestedErrors.join('; ');
      return;
    }

    if (typeof nestedErrors === 'object') {
      for (const key of Object.keys(nestedErrors)) {
        if (!fieldKeys.includes(key)) continue;

        const value = nestedErrors[key];
        const msg = Array.isArray(value) ? value.join('; ') : String(value);
        errors[key] = msg;
      }
    } else {
      errors.form = String(nestedErrors);
      return;
    }
  }

  if (nested?.message && !errors.form) {
    errors.form = Array.isArray(nested.message)
      ? nested.message.join('; ')
      : String(nested.message);
    return;
  }

  if (apiPayload?.message && !errors.form) {
    errors.form = String(apiPayload.message);
    return;
  }

  if (apiPayload?.error && !errors.form) {
    errors.form = String(apiPayload.error);
    return;
  }

  errors.form = parseApiError(error, fallbackMessage);
};
