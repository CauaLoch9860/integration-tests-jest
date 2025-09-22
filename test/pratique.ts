import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';

describe('Pet Store API - User Management', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://petstore.swagger.io/v2';

  p.request.setDefaultTimeout(90000);

  beforeAll(async () => {
    p.reporter.add(rep);
  });

  describe('Users - Create User', () => {
    it('should create a new user', async () => {
      const user = {
        id: faker.number.int(),
        username: faker.internet.username(), 
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        userStatus: 0
      };

      await p
        .spec()
        .post(`${baseUrl}/user`)
        .withJson(user)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains(user.id.toString());
    });
  });

  afterAll(() => p.reporter.end());
});
