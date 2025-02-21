const HTTP_MESSAGES = {
  internal: {
    status_500:
      'An unexpected error occurred! Please check the error log below.',
  },
  user: {
    create: {
      status_200: 'User successfully created!',
      status_409:
        'The email matches another account. Please choose a different email.',
      status_500:
        'An unexpected error occurred while creating the new user. Please check the error log for more information.',
    },
    fetchAll: {
      status_200: 'Users successfully found',
      status_404: 'There are no users to show!',
      status_500:
        'An unexpected error occurred while fetching the users. Please check the error log for more information.',
    },
    fetchOne: {
      status_200: 'User successfully found!',
      status_404: 'The user was not found or the ID is invalid.',
      status_500:
        'An unexpected error occurred while fetching the users. Please check the error log for more information.',
    },
    update: {
      status_200: 'User successfully updated!',
      status_404: 'The user was not found or the ID is invalid.',
      status_500:
        'An unexpected error occurred while updating the user. Please check the error log for more information.',
    },
    delete: {
      status_200: 'User successfully deleted!',
      status_404: 'The user was not found or the id is not valid',
      status_500:
        'An unexpected error occurred while deleting the user. Please check the error log for more information.',
    },
  },
};

export default HTTP_MESSAGES;
