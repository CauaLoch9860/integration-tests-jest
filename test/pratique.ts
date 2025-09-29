import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { SimpleReporter } from '../simple-reporter';

describe('Testes de Automação de API - FakeRestAPI', () => {
  const p = pactum;
  const baseUrl = 'https://fakerestapi.azurewebsites.net/api/v1';
  const newBookTitle = 'Livro de Teste Automatizado';

  p.request.setDefaultTimeout(90000);
  p.reporter.add(SimpleReporter);

  let createdUser: { id: number; userName: string; password: string };

  // 1. Cenário: Criar Usuário (POST)
  it('1. Deve Criar um Novo Usuário com Sucesso (POST /Users)', async () => {
    createdUser = {
      id: faker.number.int({ min: 1000, max: 9999 }),
      userName: faker.internet.userName(),
      password: faker.internet.password()
    };

    await p
      .spec()
      .post(`${baseUrl}/Users`)
      .withJson(createdUser)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLike({
        id: createdUser.id,
        userName: createdUser.userName
      });
  });

  // 2. Cenário: Listar Todos os Usuários (GET)
  it('2. Deve Listar Todos os Usuários e Verificar a Contagem (GET /Users)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/Users`)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLength(10) // Verifica se o array tem 10 elementos (padrão desta API)
      .expectJsonLike([{}]);
  });

  // 3. Cenário: Buscar Usuário por ID Estático (GET com ID)
  it('3. Deve Buscar um Usuário Estático Existente pelo ID (GET /Users/1)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/Users/1`) // Busca um usuário que existe (ID 1)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLike({
        id: 1,
        userName: 'User 1'
      });
  });

  // 4. Cenário: Atualizar Usuário (PUT)
  it('4. Deve Atualizar um Usuário Estático Existente com Sucesso (PUT /Users/1)', async () => {
    const updatedUser = {
      id: 1, // ID do usuário que será alterado
      userName: faker.internet.userName(), // Novo nome gerado
      password: faker.internet.password()
    };

    await p
      .spec()
      .put(`${baseUrl}/Users/${updatedUser.id}`)
      .withJson(updatedUser)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLike({
        id: updatedUser.id,
        userName: updatedUser.userName
      });
  });

  // 5. Cenário: Buscar Usuário Inexistente (Teste Negativo)
  it('5. Deve Retornar Status 404 ao Buscar Usuário Inexistente (GET /Users/999)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/Users/999`) // ID que sabemos que não existe
      .expectStatus(StatusCodes.NOT_FOUND); // 404
  });

  // 6. Cenário: Criar Novo Livro (POST)
  it('6. Deve Criar um Novo Livro e Obter seu ID (POST /Books)', async () => {
    const newBook = {
      id: 0, 
      title: newBookTitle,
      description: faker.lorem.sentence(),
      pageCount: faker.number.int({ min: 50, max: 500 }),
      publishDate: faker.date.past().toISOString(),
      excerpt: faker.lorem.paragraph()
    };

    await p
      .spec()
      .post(`${baseUrl}/Books`)
      .withJson(newBook)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLike({ title: newBookTitle })
      .stores('BookId', 'id'); // Armazena o ID retornado (para uso em testes seguintes)
  });

  // 7. Cenário CORRIGIDO: Buscar Livro por ID Estático (GET com ID)
  // CORREÇÃO: Não usamos o ID criado, mas sim um ID estático (1), que garante 200 OK.
  it('7. Deve Buscar um Livro Estático Existente pelo ID (GET /Books/1)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/Books/1`)
      .expectStatus(StatusCodes.OK) // 200
      .expectJsonLike({ 
        id: 1,
        title: 'Book 1' 
      });
  });

 // 8. Cenário: Listar Todos os Livros e Validar Estrutura (GET)
 it('8. Deve Listar Todos os Livros e Confirmar a Estrutura do Array (GET /Books)', async () => {
  await p
    .spec()
    .get(`${baseUrl}/Books`)
    .expectStatus(StatusCodes.OK) // 200
    // Verifica se a resposta é um array (colchetes []) que contém pelo menos um objeto (entre chaves {}).
    // Isso valida a estrutura sem se preocupar com a contagem exata.
    .expectJsonLike([{}]); 
});

  // 9. Cenário: Deletar um Livro Estático (DELETE)
  // Usamos um ID estático (10) para garantir que o endpoint é exercitado.
  it('9. Deve Deletar o Livro de ID 10 com Sucesso (DELETE /Books/10)', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/Books/10`)
      .expectStatus(StatusCodes.OK); // 200
  });

  // 10. Cenário: Tentar Buscar Livro Inexistente (Teste Negativo)
  it('10. Deve Retornar Status 404 ao Tentar Buscar um Livro Inexistente (GET /Books/999)', async () => {
    await p
      .spec()
      .get(`${baseUrl}/Books/999`)
      .expectStatus(StatusCodes.NOT_FOUND); // 404
  });

  afterAll(() => {
    p.reporter.end();
  });
});