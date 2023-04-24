
# link: https://3380.vercel.app
# link to dump file: https://github.com/f0rc/3380/blob/main/final.dump


# PostOffice Database Application: TEAM 4 Tu/Th

We built the PostOffice web app with four main roles:

- Customer
  - Customer (no account)
  - Customer (account)
    - Example login info:
      - Email: Beatrice80@hotmail.com
      - Password: Beatrice80@hotmail.com
- Employee
  - Clerk
    - Login info:
      - Email: Iva.Prosacco98@gmail.com
      - Password: Iva.Prosacco98@gmail.com
  - Driver
    - Login info:
      - Email: Deven_Collier8@hotmail.com
      - Password: Deven_Collier8@hotmail.com
  - Manager
    - Login info:
      - Email: Audreanne_Mills85@yahoo.com
      - Password: Audreanne_Mills85@yahoo.com
- Admin
  - CEO
    - Login info:
      - Email: admin@admin.com
      - Password: admin@admin.com

Customers without an account can track a package by entering the tracking ID on the home page (the package tracking page). To purchase items from the store, they must sign up or log in.

- Employee
  - All employees can log their daily hours after their shift on the work log page.
  - Clerk
    - Clerks create packages for customers at their assigned post office location.
  - Manager
    - The manager is responsible for the low stock trigger, which displays a notification for products with <=10 items in stock.
    - Managers can hire clerks and drivers on the add employee page.
    - Managers can edit employee information.
    - Managers are responsible for updating their store and maintaining product stock:
      - Update product
      - Add product
      - Manage product
- Admin
  - The CEO can view reports:
    - Package report: Shows the number of packages with applied filters.
    - Employee report: Displays hours worked by employees at each post office location.
    - Product report: Shows revenue from selling products at specific locations.

# note: 
- When an employee signs up, they must use the same email they provided when hired. There is a trigger that maps their employee profile to their user profile, granting them the appropriate role.

- The same process applies if the order is reversed.

# TRIGGERS:
  - lowstock trigger which displays a notification to the manager which is only resolved when the manager updates the stock to greater than 10
  - We implemented a second trigger to update the package status to "in transit." The system checks for multiple transits (<=4) and identifies the processing locations for each package. The customer sees the updated status and is informed if a package has a less than 10% chance of being delivered.

# Reports

As mentioned earlier, the available reports are:

- Package report
- Employee hours report
- Product revenue report

# Steps to Run the Application:

1. Ensure you have Node.js version 18-19 (LTS) installed (version 20 does not work).
2. Run `npm i` in `./`, `./client/`, and `./server/`.
3. Image uploading will not work, as it requires sensitive data.
4. Create a .env file in `./client/` and `./server/`, then copy and paste the values from `.env.example` located in `./client` and `./server`.
5. Ensure you have Docker Compose installed and run `docker-compose up -d` in the root folder to start the PostgreSQL database with test variables.
6. install tsx (globally) and then Run `npm run db` in `./server/` to load the default app data, including admin information, into the database.
7. (Optional) To populate fake data, install tsx (globally) and run `tsx ./database/faker.ts` in `./server/`.
8. To run the application, ensure you are in the root directory and run `npm run dev` for local development. The application will be available at `http://localhost:3000`.

