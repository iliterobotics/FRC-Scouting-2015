// grab the Match model
var mongoose = require("mongoose");
var Match = mongoose.model('Match');

module.exports = function(app) {

  this.saveMatch = function(match, cb) {
    Match.find({_id : match._id}, function (err, docs) {
			if (docs.length){
				cb('match ' + match._id + ' already exists',null);
			}else{

				match.save(function(err){
					cb(err,match);
				});
			}
    });
  };
  
  var matchRoutes = this;
  
  //listing level routes
  //optional var for team #
  app.route('/v1/match').post(function(req, res) {
    console.log("Attempting to add match",req.body);
    // use mongoose to get all matchs in the database
    matchRoutes.saveMatch(new Match(req.body), function(err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .get(function(req, res) {
    // use mongoose to get all matchs in the database
    Match.find(function(err, matchs) {

      // if there is an error retrieving, send the error. 
      // nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }

      res.json(matchs); // return all matchs in JSON format
    });
  });
  
  //individual match-level CRUD
  app.route('/v1/match/:id').get(function (req, res){

    Match.findById(req.params.id, function (err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .put(function (req, res){

    Match.findByIdAndUpdate(req.params.id, req.body, function (err, match) {
    if (err) {
      res.send(err);
    } else {
      res.send(match);
    }
  });
  })
	.post(function(req, res) {
    console.log("Attempting to add match",req.body);
    // use mongoose to get all matchs in the database
    matchRoutes.saveMatch(new Match(req.body), function(err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .delete(function (req, res){

    Match.findById(req.params.id, function (err, match) {
      if(err) {
        res.send(err);
      } else {
        console.log('removing match', match);
        match.remove(function (err) {
          if (!err) {
            console.log("removed match", match._id);
            res.send('');
          } else {
            console.log(err);
            res.send(err);
          }
        });
      }
    });
  });
  
};