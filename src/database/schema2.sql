CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,  
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "birthDate" DATE NOT NULL,

    "role" TEXT NOT NULL CHECK ("role" IN('Manager','Clerk', 'Driver' )),
    "salary" INTEGER NOT NULL CHECK ("salary" >= 0),

    "add_Street" TEXT NOT NULL,
    "add_Street_2" TEXT,
    "add_City" TEXT NOT NULL,
    "add_State" TEXT NOT NULL,
    "add_ZipCode" INTEGER NOT NULL,
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
    
    "street" TEXT NOT NULL,
    "street_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    
    "updatedAt" Date NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "customerAccount_pkey" PRIMARY KEY ("customerID")
);

CREATE TABLE "Package_Location_History" (
    "locationHistoryID" TEXT NOT NULL,
    "packageID" TEXT NOT NULL,
    "loctionID" TEXT NOT NULL,
    -- make a status
    "status" TEXT NOT NULL CHECK ("status" IN('Accepted', 'In Transit', 'Out for Delivery', 'Unsuccessful Attempts')),
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locationHistory_pkey" PRIMARY KEY ("locationHistoryID")

    -- "originLocation" TEXT NOT NULL,
    -- "inTransitLocation1" TEXT NOT NULL,
    -- "inTransitLocation2" TEXT,
    -- "finalLocation" TEXT NOT NULL,
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
    "createdBy" TEXT NOT NULL, --Employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --Employee ID

    CONSTRAINT "package_pkey" PRIMARY KEY ("packageID"),
    CONSTRAINT "package_sender_fkey" FOREIGN KEY ("senderID") REFERENCES "Customers"("customerID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "package_receiver_fkey" FOREIGN KEY ("receiverID") REFERENCES "Customers"("customerID") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "Package_Location_History" ADD CONSTRAINT "FK_PackageID" FOREIGN KEY ("packageID") REFERENCES "Package"("packageID") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE TABLE "Post_Office_Loactions" (
    "locationID" TEXT NOT NULL, --Pkey
    "locationName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "manager" TEXT NOT NULL,    --uses Fkey


    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL, --Employee ID
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL, --Employee ID
    

    CONSTRAINT "location_pkey" PRIMARY KEY ("locationID"),
    CONSTRAINT "FK_PostOffice_Loaction_Manager" FOREIGN KEY ("manager") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Work_For" (
    "employeeID" TEXT NOT NULL, --Pkey 
    "locationID" TEXT NOT NULL, --Pkey
    "hours" INTEGER NOT NULL,

    CONSTRAINT "workFor_pkey" PRIMARY KEY ("employeeID", "locationID"),
    CONSTRAINT "FK_WorkFor_Employee" FOREIGN KEY ("employeeID") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FK_WorkFor_Location" FOREIGN KEY ("locationID") REFERENCES "Post_Office_Loactions"("locationID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "check_hours" CHECK (hours > 0 AND hours < 168)
);

CREATE TABLE "Company"(
    "id" TEXT NOT NULL,
    "ceo_fistName" VARCHAR(30) NOT NULL,
    "ceo_lastName" VARCHAR(30) NOT NULL,
    "ceo_email" TEXT NOT NULL,
    "ceo_phoneNumber" INTEGER NOT NULL,
    "CompanyName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Truck" (
    "truckID" TEXT NOT NULL PRIMARY KEY,
    "truckType" VARCHAR(20) NOT NULL CHECK ("truckType" IN('llv','van', 'semitruck')),
    "truckStatus" VARCHAR(20) NOT NULL CHECK ("truckStatus" IN('available', 'out', 'inactive')),
    "truckLocation" TEXT NOT NULL,
    "nextMaintenance" DATE NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY ("truckLocation") REFERENCES "Post_Office_Loactions"("locationID")
);

CREATE TABLE "Driver" (
    "DriverID" TEXT NOT NULL PRIMARY KEY,
    "EmployeeID" TEXT NOT NULL,
    "TruckID" TEXT NOT NULL,
    "LicenseNumber" VARCHAR(20) NOT NULL,
    FOREIGN KEY ("TruckID") REFERENCES "Truck"("truckID"),
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Clerk" (
    "ClerkID" TEXT NOT NULL PRIMARY KEY,
    "EmployeeID" TEXT NOT NULL,
    "numberOfPackages" INTEGER NOT NULL CHECK ("numberOfPackages" >= 0),
    "revenue" INTEGER NOT NULL CHECK ("revenue" >= 0),
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Dependents" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birthdate" DATE NOT NULL,
    "EmployeeID" TEXT NOT NULL,
    "relationship" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id"),
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("id")
);

CREATE TABLE "Product" (
    "ProductID" TEXT NOT NULL,
    "ItemName" TEXT NOT NULL,
    "Cost" INT NOT NULL, --cost to buy
    "MSRP" INT NOT NULL, --cost to sell MSRP = Manufacturer Suggested Retail Price

    CONSTRAINT "ProductID" PRIMARY KEY ("ProductID")
);

CREATE TABLE "Order" (
    "OrderID" TEXT NOT NULL,
    "ProductID" TEXT NOT NULL,
    "Qty" SMALLINT NOT NULL,
    "DateOfPurchase" DATE NOT NULL DEFAULT CURRENT_DATE, 
    "updatedBy" TEXT NOT NULL, 

    PRIMARY KEY ("OrderID"),
    FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID")
);

CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT DEFAULT 'Customer' NOT NULL CHECK ("role" IN('Manager','Clerk', 'Driver', 'Customer' )),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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

