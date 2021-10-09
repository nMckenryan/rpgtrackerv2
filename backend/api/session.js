// const router = require('express').Router();
// let Session = require('../models/session.model');

// router.route('/').get((req, res) => {
//   Session.find()
//     .then(sessions => res.json(sessions))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// //CREATE SESSION
// router.route('/add').post((req, res) => {
//     const campaign = req.body.campaign;
//     const character = req.body.character;
//     const sesLog = req.body.sesLog;
//     const date = Date.parse(req.body.date); //2009-06-15T13:45:30 for testing

//     const newSession = new Session({
//       campaign,
//       character,
//       sesLog,
//       date,
//     });

//     newSession.save()
//     .then(() => res.json('Session added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
//   });

// //RETRIEVE SESSION
// router.route('/:id').get((req, res) => {
//   Session.findById(req.params.id)
//     .then(exercise => res.json(exercise))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// //UPDATE SESSION
// router.route('/update/:id').post((req, res) => {
//   Session.findById(req.params.id)
//     .then(session => {
//       session.campaign = req.body.campaign;
//       session.character = req.body.character;
//       session.sesLog = req.body.sesLog;
//       session.date = Date.parse(req.body.date);

//       session.save()
//         .then(() => res.json('Session updated!'))
//         .catch(err => res.status(400).json('Error: ' + err));
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// //DELETE SESSION
// router.route('/:id').delete((req, res) => {
//   Session.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Session deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// module.exports = router;
