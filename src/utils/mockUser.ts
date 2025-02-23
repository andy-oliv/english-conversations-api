import { faker } from '@faker-js/faker/.';
import { UserRoles } from '@prisma/client';

export default function generateMockUser() {
  return {
    id: faker.string.uuid(),
    role: UserRoles.USER,
    name: faker.person.fullName(),
    birthdate: faker.date.birthdate(),
    email: faker.internet.email(),
    country: faker.location.country(),
    state: faker.location.state(),
    city: faker.location.city(),
    password: faker.internet.password(),
  };
}
