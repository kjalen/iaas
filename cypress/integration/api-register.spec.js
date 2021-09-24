describe('/register', () => {
    it('returns 201 with access_token in body', () => {
      cy.request('POST', 'localhost:8080/register', {"email":"kjalen@gmail.com", "password":"passwosdfsdfrd!"}).then((resp) => {
        expect(resp.status).to.eq(201)
        expect(resp.body).to.have.property('access_token')
      })
    })
  })