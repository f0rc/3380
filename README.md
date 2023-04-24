
# link: https://3380.vercel.app
# link to dump file: https://github.com/f0rc/3380/blob/main/final.dump



# PostOffice Database application TEAM 4 Tu/Th
- We built the postoffice webapp to include 4 main roles which are 
  - customer
    - customer (no account)
    - customer (account) 
      - example login info:
        - email: Beatrice80@hotmail.com
        - pass: Beatrice80@hotmail.com
  - Employee
    - clerk
      - login info:
        - email: Iva.Prosacco98@gmail.com
        - pass: Iva.Prosacco98@gmail.com
    - driver
      - email: Deven_Collier8@hotmail.com
      - pass: Deven_Collier8@hotmail.com
    - manager
      - email: Audreanne_Mills85@yahoo.com
      - pass: Audreanne_Mills85@yahoo.com
  - Admin
    - CEO
      - login info:
        - email: admin@admin.com
        - pass: admin@admin.com
- customer with no account is able to track a package by inputing the tracking ID of their package into the home page (the tracking package page) and also look at the store if they want to purchase anything then they need to sign up or log in.

- Employee
  - all emploeeyes is able to log their daily hours after their shift is up in the work log page
  - Clerk
    - clerk is able to create packages for customers when they comin into our postoffice location and it will be sent from the location which were the clerk is assaigned
  - Manager
    - # Manager is responsible for the low stock trigger:
      -  this trigger is made to show a notification to the manager about products in their store that have a <=10 in stock
    - manager is able to hire clerks and drivers on the add employee page
    - and they are able to edit their employee's information
    - managers are also responsible for updating their store and keeping up their products in stock
      - update product
      - add product
      - manage product
  - ADMIN
    - CEO is able to view reports 
      - package report: this report is to represent how many packages were with certain filters applied
      - employee report: this report is to show the hours created by the employees of each postoffice location
      - product report: this report is to show the revenue made from selling products at certain locations
- notes: when a employee they will sign up with the same email as the one they gave in order to be hired which then maps their employee profile to their user profile which then gives them the roles of their postion
    - same thing happens if the order is reversed

# 2nd trigger update package status
- we implemented a 2nd trigger to update the package status to transit and see if there can be multiple transits <=4 and get locations of offices where the package is going to be processed along with showing the status back to the customer and also determines if a package is going to be failed to deliver which is less than 10% chance

# reports: 
  - as mentioned earlier 
    - package report
    - employee hours report
    - products revenue report

# steps to run this application:
  - make sure you have node js version 18-19(LTS) (version 20 does not work)
  - run `npm i` in `./` `./client/` and `./server/`
  - the upload images is not going to work beacuse it we need to provide sensetive data
  - create a .env file in `./client/` and `./server/` and copy paste the values that are given in `.env.example` which is located in `./client` and `./server`
  - make sure you have docker-compose and run `docker-compose up -d` in root file to start up the docker image for the postgressql database with the test variables
  - run `npm run db` in `./server/` in order to run the default data of the app into the database which include the info for admin
  - (optional) to populate fake data install tsx (globally) and run in `./server/` `tsx ./database/faker.ts` in order to create some fake data
  - to run the application make sure you are in the root directory and run `npm run dev` for local development the application be on `http://localhost:3000`
