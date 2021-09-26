





### Date 
September 25th, 2021
### Time spent 
 - Auth took me about 3 hours
 - db integration took me about 3 hours to get working (never worked with mongo)
 - setting up all the endpoints, getting them to work they way i want, about 5 hours
 - tests, 2 hours. I've used Cypress before but with very different workflows. 
 - setting up postman collection, 30 minutes
 - trying and failing to get it running on heroku, 2 hours

 About 15-16 hours
### Assumptions made 
I imagined this would be used to provide primary keys for database records, but manually. I imagined a beleaguered dba inputting rows one by one into several tables and needing them to have primary keys. I wanted to make it as easy as possible for this dba to retrieve sequences. I also wanted to provide aditional functionality in the sequence object, allowing different incrementers to be used in case the developer only wanted even numbers or somesuch.

 This application would benefit from a front end, and I would of liked to make a front end, but I decided I could not fit it in the scope. I envisioned a slick vue frontend, with one button to both increment and copy the sequence to the clipboard. A checkbox that would allow the sequence to be edited in place, a reset button to put the sequence back to the start. I built the api as if this was the ultimate goal. I was just not familiar enough with the technologies and patterns to stand all of this up quickly enough. It was most important to me to deliver a working complete product, then a more complex, non-working one. I continually monitored my progress and made scope adjustments as needed to ensure I could deliver _something_.

I am not happy with the lack of validation. Most of my development was happy path and I did not add invalid input handling till very late in the process. 

I am also not happy with the tests. There is a right way to write tests, and a wrong way, I certainly did not write them the right way. I had a lot of trouble getting cypress to do what I wanted, so I had to settle for badly written, but functional, tests.

Lastly, I did endeavor to get this hosted on Heroku. I was not able to. 
### Stretch goals attempted 
A UI would of been great, but I would need another week to implement it. I removed UI from the scope very early on when I realized how much I had to figure out to get the basics running.
### Instructions to run assignment locally 
1. Clone the repo 
    ```bash
    git clone https://github.com/kjalen/iaas.git
    ```
1. Install dependancies
    ```bash
    npm install
    ```
1. Copy .env file provided to you into the root directory
1. Run the project
    ```bash
    npm start
    ```
1. Run tests
    ```bash
    npm run cy:run --spec /cypress/integration/
    ```
    - These tests can only be run once per session. Yes this is awful.
6. I've also provided the endpoints in an easy to access way via postman. With this link https://www.getpostman.com/collections/7df2ecee380c2938373f, you can import my iaas collection. It is setup to automatically grab the auth token from /register and use it as auth for all the appropriate endpoints. (Just make sure to hit /register first)
[Postman collection documentation here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#:~:text=To%20import%20Postman%20data%2C%20select,bring%20your%20data%20into%20Postman.)


### What did you not include in your solution that you want us to know about? Were you short on time and not able to include something that you want us to know about? Please list it here so that we know that you considered it. 
This was a fairly tricky assignment, there was enough here that I haven't done before, so I was fighting the technology for a lot of it trying to get it to do what I want. The end product is not quite what I had envisioned for this application, but I think I gave it a fair shot.

## Unrealized considerations
- I initially thought I wanted sequences to be in their own table, so a user could have several sequences. User table should have user data, not application data as well. This is the first time I worked with mongo though, so I decided to keep it as simple as possible
- While this application does have authentication, it does not have authorization. I wanted to have an authorization table and a userAuthority table to grant users different levels of authority, like user, admin ect. This would allow me to have some endpoints require elevated permissions.
- I wanted to build metric reporting into this app that would record frequency of use, details on users ect.
- I tried to get it runing on Heroku, with no luck. I think it has something to do with the mongo-memory-db server. If I was doing it over I would use a container to handle the db and app. I've never published an app on Heroku, I should have ensured my setup would of worked on Heroku earlier on.
- I planned on making a swagger doc for the api, but I needed to get it hosted somewhere first.


### Your feedback on this technical challenge 
Overall I liked this assignment. If nothing else, I learned a lot. It was a bit trickier than I am used to, quite a bit more involved than your standard CRUD. 
