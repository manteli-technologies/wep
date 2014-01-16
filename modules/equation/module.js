var math = require('javascript-cas')

module.exports.add_module = function(app) {

  app.get('/equation', function(req, res){
    var m = math('((((3x-5)+3)+2)/3)');
    console.log( m.s('text/latex').s );
    res.send('hello world ' + m.s('text/latex').toString() );
  });

}