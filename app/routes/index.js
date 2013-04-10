
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.template = function (req, res) {
  var name = req.params.name;
  res.render('tpl/' + name);
};