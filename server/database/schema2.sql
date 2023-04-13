CREATE TABLE "EMPLOYEE" (
    "employee_id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL UNIQUE,

    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "birthdate" DATE NOT NULL,

    "role" INTEGER DEFAULT 0 NOT NULL CHECK ("role" <= 4 AND "role" >= 0),
    "salary" INTEGER NOT NULL CHECK ("salary" >= 0),
    "manager_id" TEXT CHECK ("manager_id" != "employee_id"),

    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "startdate" DATE NOT NULL,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "EMPLOYEE_PK" PRIMARY KEY ("employee_id")
);

CREATE TABLE "CUSTOMER" (
    "user_id" TEXT, --nullable because the cutomer is created when the employee makes a pkg
    "customer_id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phoneNumber" TEXT NOT NULL,
    
    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" TEXT NOT NULL,
    
    "updatedAt" Date NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "CUSTOMER_PK" PRIMARY KEY ("customer_id")
);

CREATE TABLE "PACKAGE_LOCATION_HISTORY" (
    "package_location_id" SERIAL NOT NULL,
    "package_id" TEXT NOT NULL, --refer to Package
    "postoffice_location_id" TEXT NOT NULL,
    "intransitcounter" INTEGER NOT NULL DEFAULT 0,
    -- make a status
    "status" TEXT NOT NULL CHECK ("status" IN('accepted', 'transit', 'delivered','out-for-delivery', 'fail')),
    "processedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedBy" TEXT NOT NULL, --employee ID

    CONSTRAINT "package_location_id" PRIMARY KEY ("package_location_id")
);

CREATE TABLE "PACKAGE" (
    "package_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL, --refer to Sender_Info
    "receiver_id" TEXT NOT NULL, --refer to Reveiver_Info... the id is not made yet
    "cost" TEXT NOT NULL, --pennies 
    "weight" TEXT NOT NULL, --pounds
    "type" TEXT NOT NULL CHECK ("type" IN('envelope', 'box', 'other')),
    "size" TEXT NOT NULL CHECK ("size" IN('small', 'medium', 'large', 'extra large')),
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL, --employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --employee ID

    CONSTRAINT "PACKAGE_PK" PRIMARY KEY ("package_id"),
    CONSTRAINT "PACKAGE_SENDER_FK" FOREIGN KEY ("sender_id") REFERENCES "CUSTOMER"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PACKAGE_RECEIVER_FK" FOREIGN KEY ("receiver_id") REFERENCES "CUSTOMER"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "PACKAGE_LOCATION_HISTORY" ADD CONSTRAINT "PACKAGE_FK" FOREIGN KEY ("package_id") REFERENCES "PACKAGE"("package_id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TABLE "POSTOFFICE_LOCATION" (
    "postoffice_location_id" TEXT NOT NULL, --Pkey
    "locationname" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "postoffice_location_manager" TEXT,    --uses Fkey


    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    

    CONSTRAINT "POSTOFFICE_LOCATION_PK" PRIMARY KEY ("postoffice_location_id"),
    CONSTRAINT "POSTOFFICE_LOCATION_MANAGER_FK" FOREIGN KEY ("postoffice_location_manager") REFERENCES "EMPLOYEE"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "WORKS_FOR" (
    "works_for_id" SERIAL NOT NULL, --Pkey
    "employee_id" TEXT NOT NULL UNIQUE,
    "postoffice_location_id" TEXT,
    "hours" INTEGER DEFAULT 0 NOT NULL,

    CONSTRAINT "WORKS_FOR_PK" PRIMARY KEY ("works_for_id")
);

CREATE TABLE "WORK_LOG" (
    "work_log_id" SERIAL NOT NULL, --Pkey
    "employee_id" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WORK_LOG_PK" PRIMARY KEY ("work_log_id")
);


CREATE TABLE "TRUCK" (
    "truck_id" TEXT NOT NULL PRIMARY KEY,
    "truck_type" VARCHAR(20) NOT NULL CHECK ("truck_type" IN('llv','van', 'semitruck')),
    "truck_status" VARCHAR(20) NOT NULL CHECK ("truck_status" IN('available', 'out', 'inactive')),
    "postoffice_location_id" TEXT NOT NULL,
    "nextmaintenance" DATE NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id")
);

CREATE TABLE "DRIVER" (
    "employee_id" TEXT NOT NULL PRIMARY KEY,
    "truck_id" TEXT NOT NULL DEFAULT 'none',
    "licensenumber" VARCHAR(20) NOT NULL DEFAULT 'none',
    -- FOREIGN KEY ("truck_id") REFERENCES "Truck"("truck_id"), -- TODO: add this back in
    FOREIGN KEY ("employee_id") REFERENCES "EMPLOYEE"("employee_id")
);

CREATE TABLE "CLERK" (
    "employee_id" TEXT NOT NULL PRIMARY KEY,
    "packages_made" INTEGER NOT NULL CHECK ("packages_made" >= 0) DEFAULT 0,
    FOREIGN KEY ("employee_id") REFERENCES "EMPLOYEE"("employee_id")
);

CREATE TABLE "DEPENDANT" (
    "dependant_id" TEXT NOT NULL,
    "dependant_name" VARCHAR(255) NOT NULL,
    "dependant_birthdate" DATE NOT NULL,
    "employee_id" TEXT NOT NULL,
    "relationship" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DEPENDANT_PK" PRIMARY KEY ("dependant_id"),
    FOREIGN KEY ("employee_id") REFERENCES "EMPLOYEE"("employee_id")
);

CREATE TABLE "PRODUCT" (
    "product_id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL,
    "product_image" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRODUCT_PK" PRIMARY KEY ("product_id")
);

CREATE TABLE "PRODUCT_INVENTORY" (
    "product_inventory_id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "postoffice_location_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRODUCT_INVENTORY_PK" PRIMARY KEY ("product_inventory_id"),
    CONSTRAINT "PRODUCT_INVENTORY_PRODUCT_FK" FOREIGN KEY ("product_id") REFERENCES "PRODUCT"("product_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PRODUCT_INVENTORY_LOCATION_FK" FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ORDER" (
    "order_id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "postoffice_location_id" TEXT NOT NULL,
    "total_price" NUMERIC(10, 2) NOT NULL,
    "order_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("order_id"),
    FOREIGN KEY ("customer_id") REFERENCES "CUSTOMER"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PRODUCT_TRANSACTION_LOCATION_FK" FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ORDER_ITEMS" (
    "order_item_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" NUMERIC(10, 2) NOT NULL,
    
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "PRODUCT_TRANSACTION_PK" PRIMARY KEY ("order_item_id"),
    CONSTRAINT "PRODUCT_TRANSACTION_PRODUCT_FK" FOREIGN KEY ("order_id") REFERENCES "ORDER"("order_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PRODUCT_ITEM_FK" FOREIGN KEY ("product_id") REFERENCES "PRODUCT"("product_id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- role 0 = Customer
-- role 1 = Clerk
-- role 2 = Driver
-- role 3 = Manager
-- role 4 = CEO

CREATE TABLE "USER" (
    "user_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER DEFAULT 0 NOT NULL CHECK ("role" <= 4 AND "role" >= 0),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "USER_PK" PRIMARY KEY ("user_id")
);

CREATE TABLE "SESSION" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SESSION_PK" PRIMARY KEY ("session_id")
);



CREATE UNIQUE INDEX "SESSION_INDEX_KEY" ON "SESSION"("token");

CREATE UNIQUE INDEX "USER_EMAIL_INDEX" ON "USER"("email");

ALTER TABLE "SESSION" ADD CONSTRAINT "SESSION_USER_ID_FK" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- this trigger is to make new entries in the Clerk and Driver table when new employee's are added or update a current employee's role
CREATE OR REPLACE FUNCTION create_employee_role_data()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.role = 1 THEN
            IF NOT EXISTS (SELECT 1 FROM "CLERK" WHERE "employee_id" = NEW.employee_id) THEN
                INSERT INTO "CLERK" ("employee_id")
                VALUES (NEW.employee_id);
            END IF;
            RETURN NEW;
        ELSIF NEW.role = 2 THEN
            IF NOT EXISTS (SELECT 1 FROM "DRIVER" WHERE "employee_id" = NEW.employee_id) THEN
                INSERT INTO "DRIVER" ("employee_id")
                VALUES (NEW.employee_id);
            END IF;
            RETURN NEW;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.role = 1 THEN
            IF NOT EXISTS (SELECT 1 FROM "CLERK" WHERE "employee_id" = NEW.employee_id) THEN
                INSERT INTO "CLERK" ("employee_id")
                VALUES (NEW.employee_id);
            END IF;
            RETURN NEW;
        ELSIF NEW.role = 2 THEN
            IF NOT EXISTS (SELECT 1 FROM "DRIVER" WHERE "employee_id" = NEW.employee_id) THEN
                INSERT INTO "DRIVER" ("employee_id")
                VALUES (NEW.employee_id);
                RETURN NEW;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_employee_role_data_trigger
AFTER INSERT OR UPDATE ON "EMPLOYEE"
FOR EACH ROW
EXECUTE FUNCTION create_employee_role_data();

-- this trigger is to update "EMPLOYEE" ANDOR "CUSTOMER" table with USERID column when a new user is added
CREATE OR REPLACE FUNCTION insert_user() RETURNS TRIGGER AS $$
BEGIN
    -- Check if there is a matching Employee and insert user ID into Employee table
    IF EXISTS (SELECT 1 FROM "EMPLOYEE" WHERE "email" = NEW."email") THEN
        UPDATE "EMPLOYEE" SET "user_id" = NEW."user_id" WHERE "email" = NEW."email";
        -- update the role of the NEW user in the user table
        UPDATE "USER" SET "role" = (SELECT "role" FROM "EMPLOYEE" WHERE "email" = NEW."email") WHERE "email" = NEW."email";
        RETURN NEW;
    END IF;
    
    -- Check if there is a matching Customer and insert user ID into Customer table
    IF EXISTS (SELECT 1 FROM "CUSTOMER" WHERE "email" = NEW."email") THEN
        UPDATE "CUSTOMER" SET "user_id" = NEW."user_id" WHERE "email" = NEW."email";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_user_trigger
BEFORE INSERT ON "USER"
FOR EACH ROW
EXECUTE FUNCTION insert_user();


-- put userid into employee table when a new employee is added
CREATE OR REPLACE FUNCTION insert_employee() RETURNS TRIGGER AS $$
DECLARE
    emp_user_id TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM "USER" WHERE "email" = NEW."email") THEN
        SELECT "user_id" INTO emp_user_id FROM "USER" WHERE "email" = NEW."email";
        UPDATE "EMPLOYEE" SET "user_id" = emp_user_id WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_employee_trigger
AFTER INSERT ON "EMPLOYEE"
FOR EACH ROW
EXECUTE FUNCTION insert_employee();

-- put userid into customer table when a new customer is added
CREATE OR REPLACE FUNCTION insert_Customer() RETURNS TRIGGER AS $$
DECLARE
    user_id_money TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM "USER" WHERE "email" = NEW."email") THEN
        SELECT "user_id" INTO user_id_money FROM "USER" WHERE "email" = NEW."email";
        UPDATE "CUSTOMER" SET "user_id" = user_id_money WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_employee_trigger
AFTER INSERT ON "CUSTOMER"
FOR EACH ROW
EXECUTE FUNCTION insert_Customer();

-- update "USER" table when a new "USER" is added with the same role as the "EMPLOYEE" table if the "EMPLOYEE" table has a matching email
CREATE OR REPLACE FUNCTION update_user_role() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "EMPLOYEE" WHERE "email" = NEW."email") THEN
        UPDATE "USER" SET "role" = (SELECT "role" FROM "EMPLOYEE" WHERE "email" = NEW."email") WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_role_trigger
AFTER INSERT ON "USER"
FOR EACH ROW
EXECUTE FUNCTION update_user_role();


-- table to store the low stock alerts
CREATE TABLE "LOW_STOCK_ALERTS" (
    "alert_id" SERIAL NOT NULL,
    "product_inventory_id" INTEGER NOT NULL,
    "postoffice_location_id" TEXT NOT NULL,
    "alert_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_resolved" BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT "LOW_STOCK_ALERTS_PK" PRIMARY KEY ("alert_id"),
    CONSTRAINT "LOW_STOCK_ALERTS_PRODUCT_INVENTORY_FK" FOREIGN KEY ("product_inventory_id") REFERENCES "PRODUCT_INVENTORY"("product_inventory_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LOW_STOCK_ALERTS_LOCATION_FK" FOREIGN KEY ("postoffice_location_id") REFERENCES "POSTOFFICE_LOCATION"("postoffice_location_id") ON DELETE CASCADE ON UPDATE CASCADE
);
-- trigger to create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.quantity <= 10 THEN
        INSERT INTO "LOW_STOCK_ALERTS" ("product_inventory_id", "postoffice_location_id")
        VALUES (NEW.product_inventory_id, NEW.postoffice_location_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER low_stock_trigger
AFTER INSERT OR UPDATE ON "PRODUCT_INVENTORY"
FOR EACH ROW
EXECUTE FUNCTION check_low_stock();

-- trigger to resolve low stock alerts
CREATE OR REPLACE FUNCTION resolve_low_stock_alerts() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') AND NEW.quantity > 10 THEN
        UPDATE "LOW_STOCK_ALERTS" SET "is_resolved" = TRUE WHERE "product_inventory_id" = NEW.product_inventory_id AND "postoffice_location_id" = NEW.postoffice_location_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resolve_low_stock_alerts_trigger
AFTER UPDATE ON "PRODUCT_INVENTORY"
FOR EACH ROW
EXECUTE FUNCTION resolve_low_stock_alerts();

CREATE TABLE "EMAIL_NOTIFICATION" (
    "email_notification_id" SERIAL NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EMAIL_NOTIFICATION_PK" PRIMARY KEY ("email_notification_id")
);


-- -- email trigger
-- CREATE OR REPLACE FUNCTION email_after_update()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     sender_email TEXT;
--     receiver_email TEXT;
-- BEGIN
--     SELECT c.email
--     INTO sender_email
--     FROM "CUSTOMER" c
--     JOIN "PACKAGE" p ON p.sender_id = c.customer_id
--     WHERE p.package_id = NEW.package_id;

--     SELECT c.email
--     INTO receiver_email
--     FROM "CUSTOMER" c
--     JOIN "PACKAGE" p ON p.receiver_id = c.customer_id
--     WHERE p.package_id = NEW.package_id;

--     INSERT INTO "EMAIL_NOTIFICATION" (recipient, subject, body)
--     VALUES (sender_email, 'Order Update', 'Thank you for your order. Your order ID is ' || NEW.package_id || ' and its current status is ' || NEW.status || '.');

--     INSERT INTO "EMAIL_NOTIFICATION" (recipient, subject, body)
--     VALUES (receiver_email, 'Order Update', 'Thank you for your order. Your order ID is ' || NEW.package_id || ' and its current status is ' || NEW.status || '.');

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER email_after_update_trigger
-- AFTER UPDATE ON "PACKAGE_LOCATION_HISTORY"
-- FOR EACH ROW
-- EXECUTE FUNCTION email_after_update();


CREATE OR REPLACE FUNCTION email_after_insert()
RETURNS TRIGGER AS $$
DECLARE
    sender_email TEXT;
    receiver_email TEXT;
BEGIN
    SELECT c.email
    INTO sender_email
    FROM "CUSTOMER" c
    JOIN "PACKAGE" p ON p.sender_id = c.customer_id
    WHERE p.package_id = NEW.package_id;

    SELECT c.email
    INTO receiver_email
    FROM "CUSTOMER" c
    JOIN "PACKAGE" p ON p.receiver_id = c.customer_id
    WHERE p.package_id = NEW.package_id;

    INSERT INTO "EMAIL_NOTIFICATION" (recipient, subject, body)
    VALUES (sender_email, 'Order Update', 'Thank you for your order. Your order ID is ' || NEW.package_id || ' and its current status is ' || NEW.status || '.');

    INSERT INTO "EMAIL_NOTIFICATION" (recipient, subject, body)
    VALUES (receiver_email, 'Order Update', 'Thank you for your order. Your order ID is ' || NEW.package_id || ' and its current status is ' || NEW.status || '.');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_after_insert_trigger
AFTER INSERT ON "PACKAGE_LOCATION_HISTORY"
FOR EACH ROW
EXECUTE FUNCTION email_after_insert();



-- trigger to add a new entry into "WORKS_FOR" table when a new employee is added



-- does not work
-- CREATE TRIGGER adding_Profit ON orders
-- AFTER INSERT ON purchases
-- FOR EACH ROW
-- BEGIN
--     Update Company
--     CONSTRAINT "company_profit" PRIMARY KEY ("profit"),
--     CONSTRAINT "company_ProductID" PRIMARY KEY("ProductID");
--     CONSTRAINT "Product_Cost" PRIMARY KEY("Cost");

--     SELECT company_profit, company_ProductID
--     FROM Company,Product
--     SET company_profit = company_profit+Product_Cost
--     WHERE company.id = NEW.company_id;
--     END IF;
-- END;

-- CREATE TRIGGER receipt_Sender ON orders
-- FOR EACH ROW
-- BEGIN
--     CONSTRAINT "customer_email" PRIMARY KEY ("email"),
--     "order_id" INT;
--     "order_total" DECIMAL(10,2);
--     "order_date" DATE;

--     SELECT customer_email, order_id, total_amount, order_date
--     FROM customer
--     WHERE order_id = NEW.order_id;

--     IF customer_email IS NOT NULL THEN
--         SELECT CONCAT('Order Receipt for Order #', order_id, '\n\n',
--                       'Order Date: ', order_date, '\n',
--                       'Total Amount: $', order_total) AS receipt;
--     END IF;
-- END; 


-- need to fix this
-- CREATE TABLE "Company"(
--     "companyID" TEXT NOT NULL,
--     "ceo_fistName" VARCHAR(30) NOT NULL,
--     "ceo_lastname" VARCHAR(30) NOT NULL,
--     "email" TEXT NOT NULL,
--     "ceo_phoneNumber" INTEGER NOT NULL,
--     "companyName" TEXT NOT NULL,
--     "address_street" TEXT NOT NULL,
--     "address_street_2" TEXT,
--     "address_city" TEXT NOT NULL,
--     "address_state" TEXT NOT NULL,
--     "address_zipcode" INTEGER NOT NULL,
--     "revenue" INTEGER NOT NULL,
--     "profit" INTEGER NOT NULL,
--     "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT "company_pkey" PRIMARY KEY ("companyID")
-- );