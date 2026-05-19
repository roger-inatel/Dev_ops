describe('Fluxo de Autenticação', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    // Intercepta as chamadas da API para não depender do backend real
    cy.intercept('POST', '/api-backend/auth/login', {
      statusCode: 200,
      body: { access_token: 'fake-jwt-token' },
    }).as('loginRequest');

    cy.intercept('POST', '/api-backend/users', {
      statusCode: 201,
      body: { id: 1, email: 'novo@usuario.com' },
    }).as('registerRequest');
  });

  it('deve realizar o registro de um novo usuário com sucesso', () => {
    cy.visit('/registro');

    cy.get('input[name="name"]').type('Usuário de Teste');
    cy.get('input[name="email"]').type('teste@cypress.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');
    cy.get('input[name="phone"]').type('11988887777');
    cy.get('input[name="city"]').type('São Paulo');
    cy.get('select[name="state"]').select('SP');
    cy.get('input[type="checkbox"]').check();

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');
    
    // Verifica o alerta (Cypress lida com alerts automaticamente, mas podemos validar se mudou de página)
    cy.url().should('include', '/login');
  });

  it('deve realizar login e redirecionar para a home', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('teste@cypress.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Verifica se o token foi salvo no localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('adotapet_token')).to.eq('fake-jwt-token');
    });
  });

  it('deve mostrar erro ao tentar login com credenciais inválidas', () => {
    cy.intercept('POST', '/api-backend/auth/login', {
      statusCode: 401,
      body: { message: 'E-mail ou senha inválidos' },
    }).as('loginError');

    cy.visit('/login');

    cy.get('input[name="email"]').type('errado@teste.com');
    cy.get('input[name="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginError');

    cy.contains('E-mail ou senha inválidos').should('be.visible');
  });
});
