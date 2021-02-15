# GameFinity - Backend

## What is GameFinity?

GameFinity is a console games shop, the purpose of this application is to master the skills that we obtained through the Web Development - Backend course.

Frontend developers: Snezana Nikolic, Nemanja Riganovic, Luka Marojevic. <br/>
Backend developers: Jovan Popovic, Alan Adzagic.

Click [here]() to visit our application (its not hosted yet). <br/>
Click [here](https://gamefinity-api.herokuapp.com/) to visit our API (currently deployed with Heroku).

Down bellow you can see all the requests that frontend is be using.

## User requests

- ### `POST /login` - Authenticate the user and return token.

- ### `GET /users` - Get all the users, authentication required.

- ### `GET /user/:username` - Get the user by username, authentication required.

- ### `POST /user/` - Create a new user, no authentication required.

- ### `PUT /user/:username` - Update the user by username, authenticaton required.

- ### `DELETE /user/:username` - Delete the user by username, authenticaton required.

## Game requests

- ### `GET /games` - Get all the games, no authentication required.

- ### `GET /games?limit=0&offset=0` - Get all the games with queries, no authentication required.

- ### `GET /game/:name` - Get the game by name, no authentication required.

- ### `POST /game?user` - Create the game by name, authentication required.

- ### `PUT /game/:name` - Update the game by username, authenticaton required.

- ### `DELETE /game/:name` - Delete the game by name, authenticaton required.

## Transaction requests

- Still in development :)

## Comment requests

- Still in development :)
