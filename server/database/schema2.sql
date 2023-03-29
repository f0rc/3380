CREATE TABLE "EMPLOYEE" (
    "employee_id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL UNIQUE,

    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "birthdate" DATE NOT NULL,

    "role" INTEGER DEFAULT 0 NOT NULL CHECK ("role" <= 4 AND "role" >= 0),
    "salary" INTEGER NOT NULL CHECK ("salary" >= 0),
    "postoffice_location_id" TEXT NOT NULL, --refer to Post_Office_Loactions

    "address_street" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "startdate" DATE NOT NULL,

    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "location_id" TEXT NOT NULL,
    "intransitcounter" INTEGER NOT NULL DEFAULT 0,
    -- make a status
    "status" TEXT NOT NULL CHECK ("status" IN('accepted', 'transit', 'delivered','out-for-delivery', 'fail')),
    "processedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "phonenumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "postoffice_location_manager" TEXT NOT NULL,    --uses Fkey


    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL, --employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --employee ID
    

    CONSTRAINT "POSTOFFICE_LOCATION_PK" PRIMARY KEY ("postoffice_location_id"),
    CONSTRAINT "POSTOFFICE_LOCATION_MANAGER_FK" FOREIGN KEY ("postoffice_location_manager") REFERENCES "EMPLOYEE"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "WORKS_FOR" (
    "works_for_id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL, --Pkey 
    "hours" INTEGER NOT NULL,

    CONSTRAINT "WORKS_FOR_PK" PRIMARY KEY ("works_for_id"),
    CONSTRAINT "WORKS_FOR_EMPLOYEE_FK" FOREIGN KEY ("employee_id") REFERENCES "EMPLOYEE"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Company"(
    "companyID" TEXT NOT NULL,
    "ceo_fistName" VARCHAR(30) NOT NULL,
    "ceo_lastname" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "ceo_phoneNumber" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_street_2" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("companyID")
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

CREATE TABLE "Product" (
    "productID" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "cost" INT NOT NULL, --cost to buy
    "msrp" INT NOT NULL, --cost to sell MSRP = Manufacturer Suggested Retail Price

    PRIMARY KEY ("productID")
);

CREATE TABLE "Order" (
    "orderID" TEXT NOT NULL,
    "productID" TEXT NOT NULL,
    "qty" SMALLINT NOT NULL,
    "dateOfPurchase" DATE NOT NULL DEFAULT CURRENT_DATE, 
    "updatedBy" TEXT NOT NULL, 

    PRIMARY KEY ("orderID"),
    FOREIGN KEY ("productID") REFERENCES "Product"("productID")
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


-- after the inser of employee, check a users table with email of the employee if it exists then update the employee table
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


CREATE OR REPLACE FUNCTION insert_Customer() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "USER" WHERE "email" = NEW."email") THEN
        UPDATE "CUSTOMER" SET "user_id" = NEW."customer_id" WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_employee_trigger
AFTER INSERT ON "CUSTOMER"
FOR EACH ROW
EXECUTE FUNCTION insert_Customer();


CREATE OR REPLACE FUNCTION insert_LOCATION_HISTORY() RETURNS TRIGGER AS $$
DECLARE
    emp_location_id TEXT;
BEGIN
    SELECT "postoffice_location_id" FROM "EMPLOYEE" WHERE "EMPLOYEE"."user_id" = NEW."createdBy" INTO emp_location_id;
    -- insert into package location history after insert on package
    INSERT INTO "PACKAGE_LOCATION_HISTORY" ("package_id","location_id", "status")
    VALUES (NEW."package_id", emp_location_id, 'accepted');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_LOCTION_HISTORY_trigger
AFTER INSERT ON "PACKAGE"
FOR EACH ROW
EXECUTE FUNCTION insert_LOCATION_HISTORY();