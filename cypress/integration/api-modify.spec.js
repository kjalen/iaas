describe('increment twice, modify', () => {
    it('logs in, increments twice, modify to 100, next is 100', () => {
        cy.request({
            method: 'POST',
            url: `localhost:8080/register`,
            body: { "email": "kjalen7@gmail.com", "password": "testpass" },
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
                    url: 'localhost:8080/modify/100',
                    headers: { 'authorization': 'Bearer ' + access_token }
                }).then((resp) => {
                    expect(resp.status).to.eq(201)
                    expect(resp.body.current).to.eq(100)
                }).then(() => {
                    cy.request({
                        method: 'GET',
                        url: 'localhost:8080/next',
                        headers: { 'authorization': 'Bearer ' + access_token }
                    }).then((resp) => {
                        expect(resp.status).to.eq(200)
                        expect(resp.body.current).to.eq(101)
                    })
                })
            })
        })
    })
})