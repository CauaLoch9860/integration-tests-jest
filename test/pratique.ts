import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';

describe('Pet Store API - User Management', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://petstore.swagger.io/v2';

  p.request.setDefaultTimeout(90000);

  // Antes de todos os testes, adicionamos o reporter
  beforeAll(async () => {
    p.reporter.add(rep);
  });

  describe('Users - Create User', () => {
    it('should create a new user', async () => {
      // Cria dados dinâmicos usando o faker para preencher a estrutura
      const user = {
        id: faker.number.int(),
        username: faker.internet.username(), // Função atualizada para evitar o aviso
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
        // Alterado para expectBodyContains para evitar erro de tipo.
        // A API retorna o id do usuário como uma string no campo 'message'.
        .expectBodyContains(user.id.toString());
    });
  });

  afterAll(() => p.reporter.end());
});
