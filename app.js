const express = require('express');

const bodyParser = require('body-parser');
const { getAuth } = require('./services/Auth.Service')
const cors = require('cors');
const morgan = require('morgan');
const { startDatabase } = require('./database/mongo');
const { getAll, findByToken, registerUser, loginUser, retrieveSeqAndIncrement, retrieveSeqAndModify, retrieveSeqAndModifyInc, resetSeq } = require('./services/UserDataService');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const errorController = require('./controller/error.controller');
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

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use(errorController);

app.post('/register', async (req, res) => {
  getAuth().then(data => {
    registerUser(req.body, data.access_token).then(result => {
      res.status(201).json({ 'access_token': result.access_token });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        console.error(err);
        res.sendStatus(422); // If i attach a message to this send i get ERR_HTTP_HEADERS_SENT, somehow it's sending this twice
      } else {
        res.sendStatus(500);
      }
    })
  });
});

app.post('/login', async (req, res) => {
  getAuth().then(data => {
    loginUser(req.body, data.access_token, req.headers['authorization']).then(result => {
      res.status(200).json({ 'access_token': result });
    })
  })
})



app.get('/next', jwtCheck, async (req, res) => {
  try {

    const result = await retrieveSeqAndIncrement(req.headers['authorization']);
    res.json({ 'current': result.current });
  } catch (err) {
    res.status(403)
  }
})


app.get('/current', jwtCheck, async (req, res) => {
  const result = await findByToken(req.headers['authorization']);
  res.json({ 'current': result.sequence.current });
})

app.put('/reset', jwtCheck, async (req, res) => {
  try {
    const result = await resetSeq(req.headers['authorization'])
    // decided between sending an empty body with 204, but i thought sending the new value as a confirmation was more useful
    res.status(201).json({ 'current': result });
  } catch (err) {
    res.sendStatus(500);
  }
})

app.put('/modify/:newvalue', jwtCheck, async (req, res) => {
  // basic validation. I'd rather this come from the User schema but can't get it to work
  if (isNaN(req.params.newvalue)) {
    res.status(422).json({ message: 'given parameter must be an integer' })
    return;
  }
  try {
    const result = await retrieveSeqAndModify(req.headers['authorization'], req.params.newvalue);
    // decided between sending an empty body with 204, but i thought sending the new object as a confirmation was more useful
    res.status(201).json(result);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.put('/modifyinc/:newinc', jwtCheck, async (req, res) => {
  if (isNaN(req.params.newinc)) {
    res.status(422).json({ message: 'given parameter must be an integer' })
    return;
  }
  try {
    const result = await retrieveSeqAndModifyInc(req.headers['authorization'], req.params.newinc)
    // decided between sending an empty body with 204, but i thought sending the new value as a confirmation was more useful
    res.status(201).json(result)
  } catch (err) {
    res.sendStatus(500)
  }
})

// mainly for debugging, gets entire db
app.get('/', jwtCheck, async (req, res) => {
  res.json(await getAll());
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {

  // start the server
  app.listen(8080, async () => {
    console.log('listening on port 8080');
  });
});