import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';

describe('ReqRes API - Users', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in/api';

  p.request.setDefaultTimeout(90000);

  beforeAll(() => {
    p.reporter.add(rep);
  });

  it('Deve listar usuários da página 2', async () => {
    await p
      .spec()
      .get(`${baseUrl}/users?page=2`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('data')
      .expectJsonLike({
        page: 2,
        data: [
          {
            id: 7,
            email: 'michael.lawson@reqres.in'
          }
        ]
      });
  });

  afterAll(() => p.reporter.end());
});
