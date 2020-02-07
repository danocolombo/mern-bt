# mern-bt

this is a project that started from a Udemy course by Brad Traversy, "MERN Stack Front to Back: Full Stack React, Redux & Node.js"

## SPRINT02

### this branch picked up in Section 3 (clip 9) "User Routes & JWT Authentication".

#### here is sample of what we added

-   built User model for registering a new user
-   added Express validator to check post body and header
-   added ability to register user (get jwt token back) (api/user POST)
-   added ability to getUser info from token (api/auth GET) + backend authentication token check
    the jwt token passed in needs to be active, from that we get the userId, then
    get the user details from mongo based on the userid returned from jwttoken.
-   ability to login... (api/auth POST) where email and password are given and token given if valid
