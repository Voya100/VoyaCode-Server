# Authentication
The server uses passport and JSON web tokens for authentication. The logging in is done with basic username/password, where password is hashed with bcrypt.

Because the authentication is currently only used to authenticate the admin user, there currently isn't a database for users. Instead account details are included in config file. The system has been implemented in a way that it should be easy to migrate to a database based system with more than just 1 user, but for now there is no need for that.

Authorization checks are done inside controllers with [AuthGuard](https://github.com/Voya100/VoyaCode-Server/blob/master/src/api/blogs/blogs.controller.ts#L74) and UseGuards pipe.
