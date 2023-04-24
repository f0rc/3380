
# link: https://3380.vercel.app
# link to dump file: https://github.com/f0rc/3380/blob/main/final.dump



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

- Customers 
  - Without account:
    - Only able to see item in 'Store', can NOT buy. 
    - Track package using PackingID via tracking page, but only see LIMITED details of the package.
  - With account:
    - Able to see and buy item in 'Store'. 
    - Able to see full details of certain package when tracking it. 
    - Able to see history of package under 'My Packages' with full details.

- Employee
  - All employees can log their daily hours after their shift on the work log page.
  - All employees also have 'My Packages' as if they ever use our service as customer, they will see their own packages there. 
  - Clerk
    - Clerks create packages for customers at their assigned post office location under 'Manage Packages'.
  - Manager
    - Having access to all the tools as regular employee.
    - Responsible for the low stock TRIGGER, which displays a notification for products with <=10 items in stock.
    - Managers can hire clerks and drivers on the 'Add Employees' page.
    - Managers can EDIT employee information.
    - Managers are responsible for updating their store and maintaining product stock:
      - Update product
      - Add product (w/ pictures)
      - Manage product
      - Delete product
- Admin (CEO) 
  - Having access to all the tools as manager (minus the 'Manage Products')
  - Can hire managers.
  - Can build/create new locations.
  - Can assign managers to certain locations. 
  - The CEO can view reports:
    - Package report: Shows the number of packages with applied filters.
    - Employee report: Displays hours worked by employees at each post office location.
    - Product report: Shows revenue from selling products at specific locations.

# note: 
- When an employee signs up, they must use the same email they provided to the supervisor when hired. There is a trigger that maps their employee profile to their user profile, granting them the appropriate role.

- The same process applies if the order is reversed.

# TRIGGERS:
  - lowstock trigger which displays a notification to the manager which is only resolved when the manager updates the stock to greater than 10
    - code: 
    - ```sql
        CREATE TRIGGER low_stock_trigger
        AFTER INSERT OR UPDATE ON "PRODUCT_INVENTORY"
        FOR EACH ROW
        EXECUTE FUNCTION check_low_stock();
      ```
      ```sql
      CREATE TRIGGER resolve_low_stock_alerts_trigger
      AFTER UPDATE ON "PRODUCT_INVENTORY"
      FOR EACH ROW
      EXECUTE FUNCTION resolve_low_stock_alerts();

      ```

  - We implemented a second trigger to update the package status to "in transit." The system checks for multiple transits (<=4) and identifies the processing locations for each package. The customer sees the updated status and is informed if a package has a less than 10% chance of being delivered.
    - code: 
      - ```sql
        CREATE TRIGGER after_package_location_history_insert
        AFTER INSERT ON "PACKAGE_LOCATION_HISTORY"
        FOR EACH ROW
        WHEN (NEW.status = 'accepted')
        EXECUTE FUNCTION simulate_delivery_system_accepted();
        ```
        - ```sql
          CREATE TRIGGER after_package_location_history_insert_transit
          AFTER INSERT ON "PACKAGE_LOCATION_HISTORY"
          FOR EACH ROW
          WHEN (NEW.status = 'transit')
          EXECUTE FUNCTION simulate_delivery_system_transit();
        ```
      - ```sql
        CREATE TRIGGER after_package_location_history_insert_out
        AFTER INSERT ON "PACKAGE_LOCATION_HISTORY"
        FOR EACH ROW
        WHEN (NEW.status = 'out-for-delivery')
        EXECUTE FUNCTION simulate_delivery_system_out();
        ```
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
6. install tsx (globally) and then Run `npm run db2` in `./server/` to load the default app data, including admin information, into the database.
7. (Optional) To populate fake data, install tsx (globally) and run `tsx ./database/faker.ts` in `./server/`.
8. To run the application, ensure you are in the root directory and run `npm run dev` for local development. The application will be available at `http://localhost:3000`.

