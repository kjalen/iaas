const express = require('express');

const bodyParser = require('body-parser');
const {getAuth} = require('./services/Auth.Service')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const { getAll, findByToken, registerUser} = require('./database/UserDataService');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
// defining the Express app
const app = express();  

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-r76hbu44.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://iaas',
  issuer: 'https://dev-r76hbu44.us.auth0.com/',
  algorithms: ['RS256']
});


// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


  app.post('/register', async (req, res) => {
      getAuth().then(data => {
        registerUser(req.body, data.access_token).then(result => {
            res.status(201).send(result.access_token);
        })
    });
})

  // delete a sequence
app.delete('/:id', async (req, res) => {
    await deleteSeq(req.params.id);
    res.send({ message: 'Sequence deleted' });
  });

  app.get('/getByToken', async (req, res) => {
    const token = req.headers['access-token']
    res.send(await findByToken(token))
  })

  app.get('/', async (req, res) => {
    res.send(await getAll());
  });



  // start the in-memory MongoDB instance
  startDatabase().then(async () => {
  
    // start the server
    app.listen(8080, async () => {
      console.log('listening on port 8080');
    });
  });