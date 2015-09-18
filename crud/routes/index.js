var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/mydb');
var pubs = db.get('pubs');

router.get('/', function(req, res, next) {
  pubs.find({$query: {}, $orderby: {date: -1}}, function (err, docs) {
    res.render('index', {pubs: docs});
  });
});

router.post('/', function(req,res,next) {
  pubs.insert({
    name: req.body.name,
    description: req.body.description,
    topics: req.body.topics,
    price: req.body.price,
    schedule: req.body.schedule,
    medium: req.body.medium,
    subscribers: []
  });
  res.redirect('/');
});

router.get('/new', function (req, res, next) {
  res.render('new')
});

router.get('/:id', function( req, res, next) {
  pubs.find({_id: req.params.id}, function (err, doc) {
    res.render('show', {pub: doc, postId: req.params.id});
  });
});
router.post('/:id/edit', function(req, res, next) {
  if (req.body.medium === "physical") req.body.medium = physical;
  if (req.body.medium === "electronic") req.body.medium = electronic;
  pubs.update({_id: req.params.id}, { $set: {
    name: req.body.name,
    description: req.body.description,
    topics: req.body.topics,
    price: req.body.price,
    schedule: req.body.schedule,
    medium: req.body.medium
  }});
  res.redirect('/' + req.params.id);
});
router.get('/:id/subscribe', function (req, res, next) {
  pubs.find({_id: req.params.id}, function(err, doc) {
    res.render('subscribe', {pubs: doc});

  //})
})
router.post('/:id/subscribe', function (req, res, next) {
  pubs.update({_id: req.params.id}, {$push: {
    subscribers: {
      subscriberId: Math.floor(900000 * Math.random()) + 100000,
      name: req.body.name,
      address: req.body.address
      email: req.body.adress
    }
  }});
  res.redirect('/' + req.params.id);
});

router.get('/:id/edit', function (req, res, next) {
  pubs.find({_id: req.params.id}, function (err, doc) {
    res.render('edit', {pub: doc});
  });
});

router.get('/:id/delete', function (req, res, next) {
  pubs.remove({_id: req.params.id});
  res.redirect('/');
});



router.get('/delete/:id/:subscriberId', function (req, res, next) {

  var filteredSubscribers = [];

  pubs.findOne({_id: req.params.id}, function (err, doc) {
    for (var i = 0; i < doc.subscribers.length; i++) {
      console.log('DOC.subscribers['+i+'].subscriberId = ', doc.subscribers[i].subscriberId);
      console.log('req.params.applicantId = ', req.params.applicantId);

      if (doc.subscribers[i].subscriberId.toString() === req.params.subscriberId.toString()) {
        console.log('Yes');
      } else {
        console.log('No');
        filteredSubscribers.push(doc.subscribers[i]);
      }
    }
    console.log('FILTERED = ', filteredSubscribers);
    pubs.update({_id: req.params.id},
      {$set: {
        subscribers: filteredSubscribers
      }
    });
  });

  res.redirect('/' + req.params.id);
});

module.exports = router;
