const integerService = require('../services/IntegerApi.Service')


export async function integer_next(req, res) {
    console.log('params ' + JSON.stringify((req.params)));
    integerService.getNextInteger(req.params.currentInt).then(data => res.send((data.toString())))
}

// function getUserIdFromAuthenticatedRequest(req) {
//   return '1'; // hardcoding for now, pending authentication implementation
// }

// export async function getAll(req, res) {
//   const userId = getUserIdFromAuthenticatedRequest(req);
//   const response = messages.filter(message => message.fromUserId === userId || message.toUserId === userId);
//   res.json(response);
// }

// export async function post(req, res) {
//   const userId = getUserIdFromAuthenticatedRequest(req);
//   const { text, toUserId } = req.body;
//   const id = messages.length + 1;

//   if (!text || !toUserId) {
//     res.status(400);
//     return res.json({ error: 'Message requires both `text` and `toUserId` fields.' });
//   }

//   const newMessage = {
//     id, text, fromUserId: userId, toUserId
//   };

//   messages.push(newMessage);
//   res.json(newMessage);
// }