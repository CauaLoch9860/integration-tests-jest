import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Reqres API', () => {
  const p = pactum;
  const rep = SimpleReporter;

  it('deve listar os usuários com sucesso', async () => {
    await p.spec()
      .get('https://reqres.in/api/users')
      .expectStatus(StatusCodes.OK)
      .expectJsonMatch({
        "page": "number",
        "per_page": "number",
        "total": "number",
        "total_pages": "number",
        "data": [
          {
            "id": "number",
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "avatar": "string"
          }
        ]
      })
      .inspect();
  });
});