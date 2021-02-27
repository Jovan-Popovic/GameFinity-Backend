# GameFinity - Backend

GameFinity is a console games shop, the purpose of this application is to master the skills that we obtained through the Web Development - Backend course.

Frontend developers: Snezana Nikolic, Nemanja Roganovic, Luka Marojevic. <br/>
Backend developers: Jovan Popovic, Alan Adzagic.

Click [here]() to visit our application (its not hosted yet). <br/>
Click [here](https://gamefinity-api.herokuapp.com/) to visit our API (currently deployed with Heroku).

Down bellow you can see all the requests that frontend is be using.

## User requests

- `GET /users` - Get all the users, authentication required.

- `GET /users?<query>` - Get all the users with queryes, this query represents any sort of filter (like firstName, lastName...), authentication required.

- `GET /user/:username` - Get the user by username, authentication required.

- `POST /user` - Create a new user, no authentication required.

- `POST /login` - Authenticate the user and return token.

- `PUT /user/:username` - Update the user by username, authenticaton required.

- `DELETE /user/:username` - Delete the user by username, authenticaton required.

## Game requests

- `GET /games` - Get all the games, no authentication required.

- `GET /games?limit=0&offset=0` - Get all the games with queries, limit presents maximum amount of returned games, offset presents amount of skipped games from the start of the request, no authentication required.

- `GET /game/:name` - Get the game by name, authentication required.

- `POST /game` - Create the game, authentication required.

- `PUT /game/:name` - Update the game by name, authenticaton required.

- `DELETE /game/:name` - Delete the game by name, authenticaton required.

## Comment requests

- `GET /comments` - Get all the comments, authentication required.

- `GET /comment/:_id` - Get the comment by id, authentication required.

- `POST /comment` - Create the comment, authentication required.

- `PUT /comment/:_id` - Update the comment by id, authenticaton required.

- `DELETE /comment/:_id` - Delete the comment by id, authenticaton required.

## Transaction requests

- `GET /transactions` - Get all the transactions, authentication required.

- `GET /transaction/:_id` - Get the transaction by id, authentication required.

- `POST /transaction` - Create the transaction, authentication required.

- `PUT /transaction/:_id` - Update the transaction by id, authenticaton required.

- `DELETE /transaction/:_id` - Delete the transaction by id, authenticaton required.
