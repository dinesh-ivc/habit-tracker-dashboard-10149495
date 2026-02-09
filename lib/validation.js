export function validateRegister(data) {
  const errors = {};
  
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  }
  
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  if (!data.role || !['user', 'admin'].includes(data.role.toLowerCase())) {
    errors.role = 'Role must be either user or admin';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateLogin(data) {
  const errors = {};

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password || data.password.length < 1) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateHabit(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Habit name must be at least 2 characters long';
  }

  if (!data.description || data.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters long';
  }

  if (!data.targetFrequency || data.targetFrequency < 1) {
    errors.targetFrequency = 'Target frequency must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}