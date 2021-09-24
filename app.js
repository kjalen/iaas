const express = require('express');

const bodyParser = require('body-parser');
const { getAuth } = require('./services/Auth.Service')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongo');
const { getAll, findByToken, registerUser, loginUser, retrieveSeqAndIncremement, retrieveSeqAndModify, retrieveSeqAndModifyInc } = require('./database/UserDataService');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const errorController = require('./controller/error.controller');
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


app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));


app.use(errorController);

app.post('/register', async (req, res) => {
  getAuth().then(data => {
    let startSequence = { "start": 1, "current": 1, "increment": 1 }
    req.body.sequence = startSequence
    registerUser(req.body, data.access_token).then(result => {
      res.status(201).send(result.access_token);
    })
  });
})


// this doesnt work
app.post('/login', async (req, res) => {
  getAuth().then(data => {
    loginUser(req.body, data.access_token).then(result => {
      if (result) {
        res.status(403).send('incorrect username/password')
      } else {
        res.status(200).send(data.access_token)
      }
    })
  });
})

// app.get('/next', jwtCheck, async (req, res) => {
//   findByToken(req.headers['authorization']).then(user => {
//     retrieveSeqAndIncremement(user).then(result => {
//       res.status(200).send(result.toString())
//     })
//   })
// })


app.get('/next', jwtCheck, async (req, res) => {
  const result = await retrieveSeqAndIncremement(req.headers['authorization'])
  res.status(200).send(result.toString())
})


app.get('/current', jwtCheck, async (req, res) => {
  const result = await findByToken(req.headers['authorization'])
  res.status(200).send(result.sequence.current.toString())
})

app.put('/modify/:newvalue', jwtCheck, async (req, res) => {
  try {
    const result = await retrieveSeqAndModify(req.headers['authorization'], req.params.newvalue)
    // decided between sending an empty body with 204, but i thought sending the new value as a confirmation was more useful
    res.send(result.toString())
  } catch (err) {
    console.log('err!');
    return err;
  }
})

app.put('/modifyinc/:newinc', jwtCheck, async (req, res) => {
  try {
    const result = await retrieveSeqAndModifyInc(req.headers['authorization'], req.params.newinc)
    // decided between sending an empty body with 204, but i thought sending the new value as a confirmation was more useful
    res.send(result.toString())
  } catch (err) {
    console.log('err!');
    return err;
  }
})

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