Cypress.Commands.add(
    'login',
    () => {
      cy.log('Logging in')
    //   const client_id = Cypress.env('auth0_client_id')
    //   const client_secret = Cypress.env('auth0_client_secret')
    //   const audience = Cypress.env('auth0_audience')
    //   const scope = Cypress.env('auth0_scope')



      cy.request({
        method: 'POST',
        url: `localhost:8080/register`,
        body: {"email":"kjalen@gmail.com", "password":"passwosdfsdfrd!"},
      }).then(({ body }) => {
        const auth = body.access_token;
        return auth;
      })
    }
  )