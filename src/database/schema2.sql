CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,  
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "birthDate" DATE NOT NULL,

    "role" TEXT NOT NULL CHECK ("role" == 'Manager' || "role" == 'Clerk' || "role" == 'Driver'),
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


CREATE TABLE "Package" (
    "package_ID" TEXT NOT NULL,
    "cost" INTEGER NOT NULL, --pennies 
    "sender" TEXT NOT NULL, --refer to Customer account
    "receiver" TEXT NOT NULL, --refer to Reveiver_Info... the id is not made yet
    "packageLocationHistory_ID" TEXT NOT NULL, --refer to history
    "createdAt" DATE NOT NULL,
    "createdBy" TEXT NOT NULL, --Employee ID
    "updatedAt" DATE NOT NULL,
    "updatedBy" TEXT NOT NULL, --Employee ID

    CONSTRAINT "package_pkey" PRIMARY KEY ("package_ID"),
    CONSTRAINT "package_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Customers"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "package_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "Customers"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "package_locationHistory_fkey" FOREIGN KEY ("packageLocationHistory_ID") REFERENCES "Package_Location_History"("locationHistoryID") ON DELETE CASCADE ON UPDATE CASCADE,
);


CREATE TABLE "Customers" (
    "customerID" TEXT NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "street" TEXT NOT NULL,
    "street_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" Date NOT NULL,
    "updatedBy" VARCHAR(30) NOT NULL,
    "createdAt" DATE NOT NULL,

    CONSTRAINT "customerAccount_pkey" PRIMARY KEY ("customerID")
);


CREATE TABLE "Package_Location_History" (
    "locationHistoryID" TEXT NOT NULL,
    "package_ID" TEXT NOT NULL,
    "loction_ID" TEXT NOT NULL,
    -- make a status
    "status" TEXT NOT NULL CHECK ("status" == 'Accepted' || "status" == 'In Transit' || "status" == 'Out for Delivery' || "status" == 'Unsuccessful Attempts')
    "createdAt" DATE NOT NULL,

    CONSTRAINT "locationHistory_pkey" PRIMARY KEY ("locationHistoryID"),
    CONSTRAINT "FK_Package_ID" FOREIGN KEY ("package_ID") REFERENCES "Package"("package_ID")

    -- "originLocation" TEXT NOT NULL,
    -- "inTransitLocation1" TEXT NOT NULL,
    -- "inTransitLocation2" TEXT,
    -- "finalLocation" TEXT NOT NULL,
);


CREATE TABLE "Post_Office_Loactions" (
    "location_ID" TEXT NOT NULL, --Pkey
    "locationName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "manager" TEXT NOT NULL,    --uses Fkey


    "createdAt" DATE NOT NULL,
    "createdBy" TEXT NOT NULL, --Employee ID
    "updatedAt" DATE NOT NULL,
    "updatedBy" TEXT NOT NULL, --Employee ID
    

    CONSTRAINT "location_pkey" PRIMARY KEY ("locationID"),
    CONSTRAINT "FK_PostOffice_Loaction_Manager" FOREIGN KEY ("manager") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Work_For" (
    "employee_ID" TEXT NOT NULL, --Pkey 
    "location_ID" TEXT NOT NULL, --Pkey
    "hours" INTEGER NOT NULL,

    CONSTRAINT "workFor_pkey" PRIMARY KEY ("employee_ID", "location_ID"),
    CONSTRAINT "FK_WorkFor_Employee" FOREIGN KEY ("employee_ID") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FK_WorkFor_Location" FOREIGN KEY ("location_ID") REFERENCES "Post_Office_Loactions"("location_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "check_hours" CHECK (hours > 0 AND hours < 168)
);

CREATE TABLE "Company"{
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
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
};

CREATE TABLE "Driver" (
    "DriverID" TEXT NOT NULL PRIMARY KEY,
    "EmployeeID" TEXT NOT NULL,
    "TruckID" TEXT NOT NULL,
    "LicenseNumber" VARCHAR(20) NOT NULL,
    FOREIGN KEY ("TruckID") REFERENCES "Trucks"("TruckID"),
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID")
);

CREATE TABLE "Clerk" (
    "ClerkID" TEXT NOT NULL PRIMARY KEY,
    "EmployeeID" TEXT NOT NULL,
    "numberOfPackages" INTEGER NOT NULL CHECK ('numberOfPackages' >= 0),
    "revenue" INTEGER NOT NULL CHECK ("revenue" >= 0),
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID")
);

CREATE TABLE Truck (
    "truckID" TEXT NOT NULL PRIMARY KEY,
    "truckType" VARCHAR(20) NOT NULL CHECK ("truckType" == 'llv' || "truckType" == 'van' || "truckType" == 'semitruck'),
    "truckStatus" VARCHAR(20) NOT NULL CHECK ("truckStatus" == 'available' || "truckStatus" == 'out' || "truckStatus" == 'inactive'),
    "truckLocation" TEXT NOT NULL,
    "nextMaintenance" DATE NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,


    FOREIGN KEY ("truckLocation") REFERENCES "Post_Office_Loactions"("location_ID")
);

CREATE TABLE "Dependents" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birthdate" DATE NOT NULL,
    "EmployeeID" TEXT NOT NULL,
    "relationship" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
    FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID")
);

CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
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

-- trigger function to update the updatedAt column on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- trigger for the Example table
CREATE TRIGGER update_example_updated_at BEFORE UPDATE ON "Example" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- create trigger for the User table
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "Users" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();