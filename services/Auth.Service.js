
const fetch = require("isomorphic-unfetch")
require('dotenv').config();

function getAuth() {

let body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: 'https://iaas',
    grant_type: 'client_credentials'
}



let url = process.env.AUTH_URL

return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())

    // return fetch(url, {method: method, headers: headers}).then(r => {
    //     if (r.ok) {
    //         return r.json()
    //     }
    // }).catch(error => {console.log(error);})

}

module.exports = { getAuth }