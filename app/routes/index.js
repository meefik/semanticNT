
/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index');
};

exports.template = function(req, res) {
    var name = req.params.name;
    res.render('tpl/' + name);
};

exports.redirect = function(req, res) {
    req.method = 'get';
    res.redirect('/');
};

exports.e404 = function(req, res) {
    res.send(404);
};