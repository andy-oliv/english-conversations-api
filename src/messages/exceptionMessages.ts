const EXCEPTION_MESSAGES = {
  general: {
    prisma_P2025: 'Record not found.',
    prisma_P2002: 'Unique constraint violation.',
  },
  user: {
    missingSaltRounds: 'Please check the SALT_ROUNDS variable.',
  },
};

export default EXCEPTION_MESSAGES;
