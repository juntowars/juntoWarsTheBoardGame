/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Games = mongoose.model('Games');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') };
  var perPage = 5;
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Games.list(options, function(err, Gamess) {
    if (err) return res.render('500');
    Games.count(criteria).exec(function (err, count) {
      res.render('games/index', {
        title: 'Gamess tagged ' + req.param('tag'),
        Gamess: Gamess,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
