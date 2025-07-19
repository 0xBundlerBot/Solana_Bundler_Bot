// Validation utilities for forms and data

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
  }

  if (value && rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (value && rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  if (value && rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push('Invalid format');
  }

  if (value && rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push('Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult => {
  const allErrors: string[] = [];

  Object.keys(rules).forEach(field => {
    const fieldResult = validateField(data[field], rules[field]);
    if (!fieldResult.isValid) {
      allErrors.push(...fieldResult.errors.map(error => `${field}: ${error}`));
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

// Specific validators
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  solanaAddress: (address: string): boolean => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  },

  positiveNumber: (value: number): boolean => {
    return !isNaN(value) && value > 0;
  },

  percentage: (value: number): boolean => {
    return !isNaN(value) && value >= 0 && value <= 100;
  },

  slippage: (value: number): boolean => {
    return !isNaN(value) && value >= 0.1 && value <= 50;
  },

  tokenAmount: (amount: string): boolean => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1000000;
  },
};

// Form validation schemas
export const validationSchemas = {
  trade: {
    inputMint: { required: true, custom: validators.solanaAddress },
    outputMint: { required: true, custom: validators.solanaAddress },
    amount: { required: true, custom: (v: string) => validators.tokenAmount(v) },
    slippage: { required: true, custom: (v: number) => validators.slippage(v) },
  },

  bundle: {
    tokenAddress: { required: true, custom: validators.solanaAddress },
    buyAmount: { required: true, custom: (v: string) => validators.positiveNumber(parseFloat(v)) },
    sellPercentage: { required: true, custom: (v: string) => validators.percentage(parseFloat(v)) },
    priorityFee: { required: true, custom: (v: string) => validators.positiveNumber(parseFloat(v)) },
    slippage: { required: true, custom: (v: string) => validators.slippage(parseFloat(v)) },
  },

  wallet: {
    address: { required: true, custom: validators.solanaAddress },
    name: { required: true, minLength: 1, maxLength: 50 },
  },

  user: {
    username: { required: true, minLength: 3, maxLength: 30, pattern: /^[a-zA-Z0-9_]+$/ },
    email: { required: true, custom: validators.email },
  },
};
