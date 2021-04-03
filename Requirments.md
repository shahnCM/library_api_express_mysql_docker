# RESTful API for Library Management
RESTful API with the following resources

1. Books
2. Authors
3. Book-Loans
4. Users

## Specification
The purpose of the API is to provide a management system for a library. There are two types of users in a Library.

- Library Member
Browse books, authors, request and view Book-Loans

- Library Admin
Create, update, remove Books and Authors. Accepet, reject Book-Loan requests. Update Book-Loan when book is returned
In addtion to providing the basic RESTful API endpoints and their role based access specified above, API should also have the following features

- Token Based Authentication (timeout can be as much as wish)
Profile image upload for users (store image anywhere like)
Browse books by author
Excel export for Book-Loans data (only Library Admin)
Implementation
It is required to implement the API using the either Django or NodeJs and any database(relational, nosql etc) of choice

### Constrainsts
- Mandatory
1. Fast response time. No endpoint should have a response time over 1 second regardless of the data size
2. Appropriate status codes with all the responses.
- Good To Have
1.Proper and easy to understand naming of variables, function and classes
2. Clear and to the point commenting of code
Code for testing the API
3. Good common sense in selecting fields for the resources