# How to Run the App

## Using Docker:
- clone / download 
- go to the project dir
- run __`docker-compose up`__
- wait for the __MySql db__ , __PhpMyAdmin__ & the __App__ to fully initialize
- Once every thing is properly runnig start playing with the end points

## Using Local Environment
#### Need to have the followings installed in your machine
1. Mysql
2. NodeJs, Npm
3. Globally installed sequelize-cli
    - to install sequelize-cli globally run this -> __`npm install -g sequelize-cli`__ in the terminal
4. Once you have all of this, go to the project dir
    - put your database `username` `password` `host` `port` in `config/config.json` file
5. Open terminal in the project root dir and type 
    - __`npm install`__
6. Make sure your mysql database is running & then in console type
    __`npm run local-boot-up`__

Take a look at scripts in `package.json` so you know what command you need to run,
```json
  "scripts": {
    "start": "node server.js",
    "migU": "sequelize db:migrate",
    "migD": "sequelize db:migrate:undo:all",
    "migF": "npm install && npm run migD && npm run migU",
    "docker-server": "nodemon server.js 0.0.0.0 5000",
    "docker-boot-up": "npm run migU && npm run docker-server",
    "local-server": "nodemon server.js 127.0.0.0 5000",
    "local-boot-up": "npm run migU && npm run local-server"
  }
```

___If any problem occurs with migration, run the scripts for migration manually___

## Resources (4)

1. Books
2. Authors
3. Book-loans
4. Users 

## All End Points at a Glance
</br>___`POST`___       `localhost:5000/api/auth/register/admin/{:key}` 
</br>___`POST`___       `localhost:5000/api/auth/register`
</br>___`POST`___       `localhost:5000/profile-image/User-One-1617391248.jpeg`
</br>___`POST`___      `localhost:5000/api/auth/login`  
___`GET`___             `localhost:5000/api/auth/user`   

</br>___`GET`___       `localhost:5000/api/authors?page=1`
</br>___`GET`___       `localhost:5000/api/authors`  (_req.query.page is set 0 by default_)
</br>___`GET`___       `localhost:5000/api/authors/{:id?}`
</br>___`POST`___      `localhost:5000/api/authors`
</br>___`PUT`___       `localhost:5000/api/authors/{:id}`
</br>___`DELETE`___    `localhost:5000/api/authors/1` 

</br>___`GET`___       `localhost:5000/api/books?page=1`
</br>___`GET`___       `localhost:5000/api/books`  (_req.query.page is set to 0 by default_)
</br>___`GET`___       `localhost:5000/api/books/{:id?}`
</br>___`POST`___      `localhost:5000/api/search/by-any?page=1` 
</br>___`POST`___      `localhost:5000/api/search/by-any`  (_req.query.page is set to 0 by default_)
</br>___`POST`___      `localhost:5000/api/books`
</br>___`PUT`___       `localhost:5000/api/books/{:id}`
</br>___`DELETE`___    `localhost:5000/api/books/{:id}`

</br>___`GET`___       `localhost:5000/book-loans?page=0`
</br>___`GET`___       `localhost:5000/book-loans/{:id?}`
</br>___`GET`___       `localhost:5000/book-loans/users/{:id}?page=3`
</br>___`GET`___       `localhost:5000/book-loans/admin/{:id}`
</br>___`POST`___      `localhost:5000/book-loans/loan`
</br>___`POST`___      `localhost:5000/book-loans/return`
</br>___`PUT`___       `localhost:5000/book-loans/{id}/take/{action}` -> `await/accept/reject`
</br>___`GET`___       `localhost:5000/api/book-loans/report/excel`
</br>___`GET`___       `localhost:5000/api/book-loans/report/excel/composite`




## User Registration & Authentication

### Resource: Users

### Admin Registration
---
Admin registration can be turned on/off from `config/default.json`

```json
{
    "jwtSecret": "secret",
    "jwtTokenName": "x-auth-token", // Name of Token, Auth Middleware will look for
    "adminRegistrationSecret": "admin-101", // Needs to be passed in URL
    "adminRegistrationOn": false, // true for enabling Admin Registration
    "perPage": 5, // Default Query / Result Limit
    "baseUrl": "http://localhost:5000/" 
}
```


__Admin Registration Route__ , </br> 
___`POST:`___ `localhost:5000/api/auth/register/admin/admin-101` 

_Validation is enabled with proper status code_ </br>
_Profile Picture is not required for Admins but required for Users_ </br>
Following fields are required: </br>
```json
{
    "name": "Admin 1",
    "email": "admin1@admin.com",
    "password": "123456"
}
```
##### ___A JWT Token will be returned after successful registration___  
- In __users__ table __isAdmin__ field is set to __1__ for __Admins__

### User Registration
---
__User Registration Route__ , </br> 
___`POST:`___ `localhost:5000/api/auth/register/` 

__Form Data__ is Required for User Registration </br>
As Profile Image is Mandatory
_Validation is enabled with proper status code_ </br>
_Profile Picture is required for Users_ </br>
Following fields are required: </br>
- name          <type: text>
- password      <type: text>
- email         <type: text>
- profile_image <type: file, Only JPEG or PNG>
- Profile Image is saved in `storage/images/UserProfileImage`
- base url, `localhost:5000/` needs to be added </br> 
before returned profile image link </br> 
`/profile-image/User-One-1617391248.jpeg` </br>
ie: `localhost:5000/profile-image/User-One-1617391248.jpeg` 

File size limit can be changed from `config/imageUpload.settings.json` through __sizeLimit__
```json
{
    "userProfileImagePath" : "storage/images/UserProfileImage",
    "serverStaticPath": "/profile-image",
    "sizeLimit" : 1000000 // in-bytes
}
```
##### ___A JWT Token will be returned after successful registration___  
- In __users__ table __isAdmin__ field is set to __0__ for __Users__

### Authentication / Login (User/Admin)
---
Authentication / Login for both User & Admin is handled through same __route__ </br>
__User/Admin Login/Authentication Route__ </br>
___`POST:`___ `localhost:5000/api/auth/login/` 

_Validation is enabled with proper status code_ </br>
Following fields are required: </br>
```json
{
    "name": "User One",
    "email": "user@One.com",
    "password": "123456"
}
```
##### ___A JWT Token will be returned after successful authentication___ 

Getting Logged in User's Info 
___`GET`___ `localhost:5000/api/auth/user/`

### Access Control through Middlewares
---
Here we have implemented __3__ middlewares for __Access Control__
1. Auth Middleware
    1. Auth.pass checks auth access & let pass
    2. Auth.block checks auth access & blocks (Prevents Login & Registration when already logged in)
2. Role Middleware
    1. Role.Admin only lets Admin pass & blocks User
    2. Role.User only lets User pass & blocks Admin
3. Feature Middleware 
    1. Admin Registration, Enable access to Admin Registration Link, checks Url key
    2. setDefaultPage, sets {req.query.page} to `0` if not provided in the __Url__


## Books & Authors
Users can __view / browse__ books & authors as a __collection__ as well as __individually__ </br>
Users can also __`search`__ books by __book name / author name__

Only Admins can ___`CREATE`___ , ___`UPDATE`___ , ___`DELETE`___ __books__ & __authors__

### Resource: Authors
---
1. ___Show All___,  _Access_ __user__ , __admin__ </br>
___GET___ `localhost:5000/api/authors?page=1` </br> 
___GET___ `localhost:5000/api/authors`  (_req.query.page is set 0 by default_)

2. ___Show Individual___,  _Access_ __admin__ </br>
___GET___ `localhost:5000/api/authors/1` </br> 

3. ___Create Author___,  _Access_ __admin__ (Expects JSON)</br>
___POST___ `localhost:5000/api/authors/` </br>
```json
{
    "name": "Degemon Big Brain"
}
``` 
4. ___Update Author___,  _Access_ __admin__ (Expects JSON)</br>
___PUT___ `localhost:5000/api/authors/1` </br>
```json
{
    "name": "Degemon Small Brain"
}
```
5. ___Delete Author___,  _Access_ __admin__ </br>
___DELETE___ `localhost:5000/api/authors/1` 

### Resource: Books
---
1. ___Show All___,  _Access_ __admin__ , __user__ </br>
___GET___ `localhost:5000/api/books?page=1` </br> 
___GET___ `localhost:5000/api/books`  (_req.query.page is set to 0 by default_)

2. ___Search By Any(Book/Author)___,  _Access_ __admin__ , __user__ </br>
___POST___ `localhost:5000/api/search/by-any?page=1` </br> 
___POST___ `localhost:5000/api/search/by-any`  (_req.query.page is set to 0 by default_)
```json
{
    "key" : "Author Name"
}
```
Or,
```json
{
    "key" : "Book Name"
}
```

3. ___Show Individual___,  _Access_ __admin__ , __user__ </br>
___GET___ `localhost:5000/api/books/1` </br> 

4. ___Create Book___,  _Access_ __admin__ (Expects JSON)</br>
___POST___ `localhost:5000/api/books/` </br>
```json
{
    "name": "Leopard's Hustle",
    "authors": [3,4] // authors id can be passed 
}
``` 
5. ___Update Book___,  _Access_ __admin__ (Expects JSON)</br>
___PUT___ `localhost:5000/api/books/1` </br>
```json
{
    "name" : "Leopards Hustle",
    "authors" : [4]
}
```
6. ___Delete Book___,  _Access_ __admin__ </br>
___DELETE___ `localhost:5000/api/books/1` 

## Book Loan & Return
- Users can __request__ for a book to __loan__ or __return__ </br>
- Users can also __view__ their own __Book-loans__
- Only Admins can Handle the Requests for Books __Loan / Return__

### Resource: Book-loans
---
1. ___Show All Book-loans___ , _Access_ __admin__, __user__ </br>
___GET___ `localhost:5000/book-loans?page=0`

    - User will see all of his / her Book-loan / return requests
    - Admin will see all kinds of requests of all users

2. ___Show Individual Book-loan___ , _Access_ __admin__, __user__ </br>
___GET___ `localhost:5000/book-loans/1`
    - Admin can view any ones Book-loan / return request
    - User can view the request matching {route.params.id} if that request was made by him / her

3. ___Show Individual Users Book-loan___ , _Access_ __admin__ </br>
___GET___ `localhost:5000/book-loans/users/1`  </br>
___GET___ `localhost:5000/book-loans/users/1?page=3`
    - Admin can view any ones Book-loan / return request matching {route.params.id}
    
4. ___Show Processed / handled Book-loan by individual admin___ , _Access_ __admin__ </br>
___GET___ `localhost:5000/book-loans/admin/1`
    - Admin can view all Book-loan / return requests handled by any admin matching {route.params.id}
    
5. ___Loan Request for A Book___ , _Access_ __user__ (Expects JSON) </br>
___POST___ `localhost:5000/book-loans/loan`  </br>
```json
{
    "book_slug" : "Book-6-1617084129"
}
```
- Have to send the slug to make a loan request for a book

6. ___Return Request for A Book___ , _Access_ __user__ (Expects JSON) </br>
___POST___ `localhost:5000/book-loans/return`  </br>
```json
{
    "tracking_id" : "4Book-6-1617084129-1617104050"
}
```
- Have to send the tracking id of the loan request to make a return request for a lend book

7. ___Accept / Reject / Await a Request___ , _Access_ __admin__ </br>
___PUT___ `localhost:5000/book-loans/17/take/await`  </br>
___PUT___ `localhost:5000/book-loans/17/take/accept`  </br>
___PUT___ `localhost:5000/book-loans/17/take/reject`  </br>

- Have to send the request id in the Url, Update the status of Request
matching that {req.params.id}
- `await` changes status to __pending__
- `reject` changes status to __accepted__
- `accept` changes status to __rejected__

8. ___Generate Book-loans Report & Export___ , _Access_ __admin__ </br>
- A Usual Excel Report with all the required column </br>
___GET___ `localhost:5000/api/book-loans/report/excel/`

- A Pair Matched Excel Composite Report </br>
___GET___ `localhost:5000/api/book-loans/report/excel/composite`