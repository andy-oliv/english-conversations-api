const VALIDATION_MESSAGES = {
  userDTO: {
    id: {
      isNotEmpty: 'The ID field cannot be empty.',
      isUUID: 'The id is invalid',
    },
    role: {
      isInRoles: 'Invalid role.',
    },
    name: {
      isNotEmpty: 'The name field cannot be empty.',
      isString: 'The name field needs to be a string.',
    },
    birthdate: {
      isNotEmpty: 'The birthdate field cannot be empty.',
      invalidDate:
        'Invalid date format. The date needs to be in ISO 8601 format. Example: 2025-02-28',
    },
    email: {
      isNotEmpty: 'The email field cannot be empty.',
      isValidEmail:
        'The email is not valid. Please insert an email following this example: user@mail.com.',
    },
    country: {
      isNotEmpty: 'The country field cannot be empty.',
      isString: 'The country field needs to be a string.',
    },
    state: {
      isNotEmpty: 'The state field cannot be empty.',
      isString: 'The state field needs to be a string.',
    },
    city: {
      isNotEmpty: 'The city field cannot be empty.',
      isString: 'The city field needs to be a string.',
    },
    password: {
      isNotEmpty: 'The password field cannot be empty.',
      isStrongPassword:
        'Please insert a strong password: at least 8 characters, 1 symbol, 1 lowercase letter, 1 uppercase letter and 1 number.',
    },
    currentLevel: {
      isInCEFRLevels: 'Invalid level.',
    },
  },
  chapterDTO: {
    title: {
      isNotEmpty: 'The title field cannot be empty.',
      isString: 'The title needs to be a string.',
    },
    description: {
      isNotEmpty: 'The description field cannot be empty.',
      isString: 'The description needs to be a string.',
    },
    mediaUrl: {
      isString: 'The mediaUrl field needs to be a string.',
    },
    duration: {
      isNotEmpty: 'The duration field cannot be empty.',
      isString: 'The duration needs to be a string.',
    },
    requiredChapterId: {
      isInt: 'The requiredChapterId field needs to be an integer.',
    },
  },
};

export default VALIDATION_MESSAGES;
