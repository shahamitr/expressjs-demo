# expressjs-demo
ExpressJS rest API demo using node, mongo, JSON web token

# How to run application in local
- You must have node install in local
- You must have mongo install in local and running on port 27017, in case you are running it on different port then change the port in application configuration.
- Run application using node

# Tools reuired to test or to see api in action
 -postman to see api response and request in action
 - mongo shell to see the database's collection is being updating or inserting rows
 
# API list
API http://localhost:8080/api

Register http://localhost:8080/api/register
needs name, password in post parameter

Authenticate http://localhost:8080/api/authenticate
needs name, password in post parameter

List : http://localhost:8080/api/users
needs token in get parameter

# Version history of the software used
- Mongo 3.2.1
- Node engine v0.10.33
