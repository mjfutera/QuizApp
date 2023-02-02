# Front-End
### Admin panel



# Back-End - API

### GET Method
* /getQuestion - 
gets questions from database
* /getCategories - 
gets category list
* /getResults - 
gets result list
* /getAwaitingQuestion - 
gets awaiting questions from DB to be approved/ modified or deleted by admin. Require Admin Password
* /getAwaitingCategory - 
gets awaiting categories from DB to be approved/ modified or deleted by admin. Require Admin Password
* /getStats - 
shows statistics for categories
* /checkPassword - 
Checks Admin Password. Required to Admin Panel

### POST Method
* /postAwaitingQuestion - 
post new question do database. !NEED TO IMPROVE DATA VERIFICATION and CHANGE FRONTEND part.
* /postResult - 
post result do database. !NEED TO IMPROVE DATA VERIFICATION
* /postNewQuestion - 
adds question to database, after approvement by admin. Require Admin Password
* /postNewCategory - 
adds category to database, after approvement by admin. Require Admin Password

### PUT Method
* /editQuestion - 
edit question in database. Require Admin Password
* /editCategory - 
edit category in database. Require Admin Password
* /editAwaitingQuestion - 
edit question in database. Require Admin Password
* /editAwaitingCategory - 
edit category in database. Require Admin Password

### DELETE Method
* /deleteQuestion - 
delete question in database. Require Admin Password
* /deleteAwaitingQuestion - 
delete awaiting question in database. Require Admin Password
* /deleteCategory - 
delete category in database. Require Admin Password
* /deleteResult - 
delete awaiting category in database. Require Admin Password