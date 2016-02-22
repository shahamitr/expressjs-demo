//Get all the required packages
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

//initialize app
var app         = express();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model from app models/user

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

mongoose.connect(config.database); // connect to database
app.set('secret', config.secret); // secret variable


//get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log requests to console
app.use(morgan('dev'));

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

//index page
apiRoutes.get('/', function(req, res) {
  res.send('API '+ 'http://localhost:' + port + '/api <br><br>' +
  'Register '+ 'http://localhost:' + port + '/api/register <br>needs name, password in post parameter<br><br>' +
  'Authenticate '+ 'http://localhost:' + port + '/api/authenticate <br>needs name, password in post parameter<br><br>' +
  'List : '+ 'http://localhost:' + port + '/api/users <br>needs token in get parameter<br><br>' +
  //'Remove '+ 'http://localhost:' + port + '/api/delete <br>needs name, token in post parameter<br><br>' +
  'NOTE: use postman to test the service and its resonse. <br><br>');
});

//setup new user in database using post request
apiRoutes.post('/register', function(req, res) {
	  var newUser = new User({ 
		name: req.body.name, 
		password: req.body.password,
		admin: false 
	  });

	  // save the user to databae
	  newUser.save(function(err) {
		if (err) throw err;
		
		res.json({
				  success: true,
				  message: 'User successfully registered.'
			});
	  });
});

// route to return all users (GET http://localhost:8080/api/autheticate)
apiRoutes.post('/authenticate', function(req, res) {
	 
	  User.findOne({name:req.body.name}, function(err, user) {
		if(!user) {
			res.send({message:"Authentication failed as user not found"});
		}
		else if(user)
		{
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				var token = jwt.sign(user, app.get('secret'), {
				  expiresInMinutes: 1440 //expires in 24 hours
				});
				
				// return the information including token as JSON
				res.json({
				  success: true,
				  message: 'Enjoy your token!',
				  token: token
				});
			}
		}
	  });
});  


apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];	
	
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('secret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

//get all users from database
// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

/*
//delete user from database
apiRoutes.get('/delete', function(req, res) {
	  User.findOne({name: req.body.name}, function(err, user) {
		  // remove user
		  user.remove(function(err, result) {
			if (err) throw err;
			
			res.json({
					  success: true,
					  message: 'User successfully deleted.'
				});
		  });
	  });
}); 
*/

app.use('/api', apiRoutes);

app.listen(port,function() {
  console.log("Started listning on port "+port);
});