const express = require('express');
const path = require('path');
const UsersService = require('../services/UsersService');
const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name } = req.body;

    for (const field of ['user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = UsersService.validatePassword(password);

    if (passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: 'Username already taken' });
        
        const newUser = {
          user_name,
          password
        };

        return UsersService.insertUser(
          req.app.get('db'),
          newUser
        )
          .then(user => {
            res
              .status(201)
              .location(path.posix.join('/UserBuilds',`/${user.user_name}`))
              .json(UsersService.serializeUser(user))
          });
      })
      .catch(next);
  });

module.exports = loginRouter;