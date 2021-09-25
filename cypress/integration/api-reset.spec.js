describe('increment twice, reset', () => {
    it('logs in, increments twice, reset, and is 1 again', () => {
        cy.request({
            method: 'POST',
            url: `localhost:8080/register`,
            body: { "email": "kjalen@gmail.com", "password": "testpass" },
        }).then(({ body }) => {
            return body.access_token
        }).then((access_token) => {
            cy.request({
                method: 'GET',
                url: 'localhost:8080/next',
                headers: { 'authorization': 'Bearer ' + access_token }
            }).then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.current).to.eq(1)
            }).then(() => {
                cy.request({
                    method: 'GET',
                    url: 'localhost:8080/next',
                    headers: { 'authorization': 'Bearer ' + access_token }
                }).then((resp) => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.current).to.eq(2)
                })
            }).then(() => {
                cy.request({
                    method: 'PUT',
                    url: 'localhost:8080/reset',
                    headers: { 'authorization': 'Bearer ' + access_token }
                }).then((resp) => {
                    expect(resp.status).to.eq(201)
                    expect(resp.body.current).to.eq(0)
                }).then(() => {
                    cy.request({
                        method: 'GET',
                        url: 'localhost:8080/next',
                        headers: { 'authorization': 'Bearer ' + access_token }
                    }).then((resp) => {
                        expect(resp.status).to.eq(200)
                        expect(resp.body.current).to.eq(1)
                    })
                })
            })
        })
    })
})