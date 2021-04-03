## Tables

- Books
- Copies
    (One2Many: Books have many Copies)
- Authors
- Books_Authors 
    (Many2Many Pivot: Table between Books & Authors)
- Users 
- BookLoan 
    (One2Many: Users have many Book Requests Loan/Return)

## Roles

- User 
    (Search/View/Loan&Return-Request Books & Upload Profile Photo)
- Admin 
    (CRUD Books & Authors, Handle Loan&Return Requests, Export Book list in Exel)

## Role Based Authentication With JWT Token
- Admin Role 0
- User  Role 1

## URLS or API-end-points

- User

1. GET  Show all Books
2. GET  Search Books by book_name / author_name
3. POST Upload Profile Pic
4. GET  Request Loan for Book
5. GET  Request Return for Book

- Admin

1. ___Every thing those users can except ( 4 & 5 )___

2. CRUD books.
    1. POST   create book
    2. GET    show books
    3. PUT    update books
    4. DELETE books

3. GET Export books in Excel

4. CRUD authors.
    1. POST   create author
    2. GET    show author
    3. PUT    update author
    4. DELETE author

5. Handle Loan / Return Request
    1. GET show all request
    2. PUT accept Loan / Return Request 
    3. PUT reject Loan / Return Request


# Request Route

1. GET /book-requests/:id?
1. GET /book-requests?page=1/:id?

if logged in as admin
    without :id
        show all requests of all kind
    with :id
        show specific request matching that :id

if logged in as user
    without :id
        show all requests of that logged in user
    with :id
        show specific request of that user matching :id
        confirm request is owned by that user
        match request.user.id == req.user.id        

2. GET /book-requests/users/:id

Must Admin
    with :id
        show specific users request
        
3. GET /book-requests/admin/:id?

Must Admin
        show only requests handled by that admin
        match request.HandledBy.id == req.user.id


## TODO
3. Put Sanitization in Routes
4. Generate Report
5. Upload Photo
4. Docker Containarize Project

1. Clean Up Codes Done
2. Put Proper Status Codes Done