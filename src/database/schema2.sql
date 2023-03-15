CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userID" TEXT,
    "email" TEXT NOT NULL UNIQUE,

    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "birthDate" DATE NOT NULL,

    "role" INTEGER DEFAULT 0 NOT NULL CHECK ("role" <= 4 AND "role" >= 0),
    "salary" INTEGER NOT NULL CHECK ("salary" >= 0),
    "locationID" TEXT NOT NULL, --refer to Post_Office_Loactions

    "address_street" TEXT NOT NULL,
    "address_street_2" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,

    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customers" (
    "userID" TEXT, --nullable because the cutomer is created when the employee makes a pkg
    "customerID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phoneNumber" TEXT NOT NULL,
    
    "address_street" TEXT NOT NULL,
    "address_street_2" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" TEXT NOT NULL,
    
    "updatedAt" Date NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "customerAccount_pkey" PRIMARY KEY ("customerID")
);

CREATE TABLE "Package_Location_History" (
    "locationHistoryID" TEXT NOT NULL,
    "packageID" TEXT NOT NULL, --refer to Package
    "loctionID" TEXT NOT NULL,
    -- make a status
    "status" TEXT NOT NULL CHECK ("status" IN('Accepted', 'In Transit', 'Deliverd', 'Unsuccessful Attempts')),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locationHistory_pkey" PRIMARY KEY ("locationHistoryID")
);

CREATE TABLE "Package" (
    "packageID" TEXT NOT NULL,
    "cost" TEXT NOT NULL, --pennies 
    "weight" TEXT NOT NULL, --pounds
    "type" TEXT NOT NULL CHECK ("type" IN('Envelope', 'Box', 'Other')),
    "size" TEXT NOT NULL CHECK ("size" IN('Small', 'Medium', 'Large', 'Extra Large')),
    "senderID" TEXT NOT NULL, --refer to Sender_Info
    "receiverID" TEXT NOT NULL, --refer to Reveiver_Info... the id is not made yet
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL, --employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --employee ID

    CONSTRAINT "package_pkey" PRIMARY KEY ("packageID"),
    CONSTRAINT "package_sender_fkey" FOREIGN KEY ("senderID") REFERENCES "Customers"("customerID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "package_receiver_fkey" FOREIGN KEY ("receiverID") REFERENCES "Customers"("customerID") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "Package_Location_History" ADD CONSTRAINT "FK_PackageID" FOREIGN KEY ("packageID") REFERENCES "Package"("packageID") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TABLE "Post_Office_Loactions" (
    "locationID" TEXT NOT NULL, --Pkey
    "locationName" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_street_2" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" INTEGER NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "manager" TEXT NOT NULL,    --uses Fkey


    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL, --employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --employee ID
    

    CONSTRAINT "location_pkey" PRIMARY KEY ("locationID"),
    CONSTRAINT "FK_PostOffice_Loaction_Manager" FOREIGN KEY ("manager") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Work_For" (
    "employeeID" TEXT NOT NULL, --Pkey 
    "locationID" TEXT NOT NULL, --Pkey
    "hours" INTEGER NOT NULL,

    CONSTRAINT "workFor_pkey" PRIMARY KEY ("employeeID", "locationID"),
    CONSTRAINT "FK_WorkFor_Employee" FOREIGN KEY ("employeeID") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FK_WorkFor_Location" FOREIGN KEY ("locationID") REFERENCES "Post_Office_Loactions"("locationID") ON DELETE CASCADE ON UPDATE CASCADE
    -- CONSTRAINT "check_hours" CHECK (hours > 0 AND hours < 168)
);

CREATE TABLE "Company"(
    "companyID" TEXT NOT NULL,
    "ceo_fistName" VARCHAR(30) NOT NULL,
    "ceo_lastName" VARCHAR(30) NOT NULL,
    "ceo_email" TEXT NOT NULL,
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
CREATE TABLE "Truck" (
    "truckID" TEXT NOT NULL PRIMARY KEY,
    "truckType" VARCHAR(20) NOT NULL CHECK ("truckType" IN('llv','van', 'semitruck')),
    "truckStatus" VARCHAR(20) NOT NULL CHECK ("truckStatus" IN('available', 'out', 'inactive')),
    "locationID" TEXT NOT NULL,
    "nextMaintenance" DATE NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY ("locationID") REFERENCES "Post_Office_Loactions"("locationID")
);

CREATE TABLE "Driver" (
    "employeeID" TEXT NOT NULL PRIMARY KEY,
    "truckID" TEXT NOT NULL DEFAULT 'none',
    "licenseNumber" VARCHAR(20) NOT NULL DEFAULT 'none',
    -- FOREIGN KEY ("truckID") REFERENCES "Truck"("truckID"),
    FOREIGN KEY ("employeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Clerk" (
    "employeeID" TEXT NOT NULL PRIMARY KEY,
    "numberOfPackages" INTEGER NOT NULL CHECK ("numberOfPackages" >= 0) DEFAULT 0,
    "revenue" INTEGER NOT NULL CHECK ("revenue" >= 0) DEFAULT 0,
    FOREIGN KEY ("employeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Dependents" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birthdate" DATE NOT NULL,
    "employeeID" TEXT NOT NULL,
    "relationship" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id"),
    FOREIGN KEY ("employeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Product" (
    "productID" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantityInStock" INT CHECK ("quantityInStock" >= 0),
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

CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER DEFAULT 0 NOT NULL CHECK ("role" <= 4 AND "role" >= 0),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);



CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Sessions"("sessionToken");

CREATE UNIQUE INDEX "User_email_key" ON "Users"("email");

ALTER TABLE "Sessions" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- this trigger is to make new entries in the Clerk and Driver table when new employee's are added or update a current employee's role
CREATE OR REPLACE FUNCTION create_employee_role_data()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.role = 1 THEN
            IF NOT EXISTS (SELECT 1 FROM "Clerk" WHERE "employeeID" = NEW.id) THEN
                INSERT INTO "Clerk" ("employeeID")
                VALUES (NEW.id);
            END IF;
            RETURN NEW;
        ELSIF NEW.role = 2 THEN
            IF NOT EXISTS (SELECT 1 FROM "Driver" WHERE "employeeID" = NEW.id) THEN
                INSERT INTO "Driver" ("employeeID")
                VALUES (NEW.id);
            END IF;
            RETURN NEW;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.role = 1 THEN
            IF NOT EXISTS (SELECT 1 FROM "Clerk" WHERE "employeeID" = NEW.id) THEN
                INSERT INTO "Clerk" ("employeeID")
                VALUES (NEW.id);
            END IF;
            RETURN NEW;
        ELSIF NEW.role = 2 THEN
            IF NOT EXISTS (SELECT 1 FROM "Driver" WHERE "employeeID" = NEW.id) THEN
                INSERT INTO "Driver" ("employeeID")
                VALUES (NEW.id);
                RETURN NEW;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_employee_role_data_trigger
AFTER INSERT OR UPDATE ON "Employee"
FOR EACH ROW
EXECUTE FUNCTION create_employee_role_data();

-- this trigger is to update "EMPLOYEE" ANDOR "CUSTOMER" table with USERID column when a new user is added
CREATE OR REPLACE FUNCTION insert_user() RETURNS TRIGGER AS $$
BEGIN
    -- Check if there is a matching Employee and insert user ID into Employee table
    IF EXISTS (SELECT 1 FROM "Employee" WHERE "email" = NEW."email") THEN
        UPDATE "Employee" SET "userID" = NEW."id" WHERE "email" = NEW."email";
    END IF;
    
    -- Check if there is a matching Customer and insert user ID into Customer table
    IF EXISTS (SELECT 1 FROM "Customers" WHERE "email" = NEW."email") THEN
        UPDATE "Customers" SET "userID" = NEW."id" WHERE "email" = NEW."email";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_user_trigger
BEFORE INSERT ON "Users"
FOR EACH ROW
EXECUTE FUNCTION insert_user();


-- after the inser of employee, check a users table with email of the employee if it exists then update the employee table
CREATE OR REPLACE FUNCTION insert_employee() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Users" WHERE "email" = NEW."email") THEN
        UPDATE "Employee" SET "userID" = NEW."id" WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_employee_trigger
AFTER INSERT ON "Employee"
FOR EACH ROW
EXECUTE FUNCTION insert_employee();


CREATE OR REPLACE FUNCTION insert_Customer() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Users" WHERE "email" = NEW."email") THEN
        UPDATE "Customers" SET "userID" = NEW."customerID" WHERE "email" = NEW."email";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_employee_trigger
AFTER INSERT ON "Customers"
FOR EACH ROW
EXECUTE FUNCTION insert_Customer();