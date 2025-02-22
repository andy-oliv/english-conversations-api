import { faker } from '@faker-js/faker';

export default function generateMockChapter() {
  return {
    id: faker.number.int(),
    title: faker.book.title(),
    description: faker.food.description(),
    mediaUrl: faker.internet.url(),
    duration: faker.string.numeric(),
    requiredChapterId: faker.number.int(),
  };
}
