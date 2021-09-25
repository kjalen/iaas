describe('increment service, start', () => {
    it('gets next, which is 1', () => {
        cy.request({
            method: 'POST',
            url: 'localhost:8080/register',
            body: { "email": "kjalen4@gmail.com", "password": "testpass" },
        }).then(({ body }) => {
            return body.access_token
        }).then((access_token) => {
            cy.request({
                url: 'localhost:8080/next',
                headers: { 'authorization': 'Bearer ' + access_token }
            }).then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.current).to.eq(1)
            }).then(() => {
                cy.request({
                    url: 'localhost:8080/next',
                    headers: { 'authorization': 'Bearer ' + access_token }
                }).then((resp) => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.current).to.eq(2)
                })
            })
        })
    })
})