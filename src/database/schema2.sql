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
CREATE TABLE "Company"{
"address" address,
"totalPostOfficeLocations" INTEGER NOT NULL,
"totalEmployees" INTEGER NOT NULL,
"totalCustomer" INTEGER NOT NULL,
"totalRevenue" INTEGER NOT NULL,
"totalPaidSalary" INTEGER NOT NULL,
"profit" INTEGER NOT NULL,
"createdAt" DATE NOT NULL, 
"updatedAt" DATE NOT NULL
};


CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,  
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "birthDate" DATE NOT NULL,
    "revenue" INTEGER NOT NULL CHECK ("revenue" >= 0),
    "role" TEXT NOT NULL CHECK ("role" == 'Manager' || "role" == 'Clerk' || "role" == 'Driver'),
    "salary" INTEGER NOT NULL CHECK ("salary" >= 0),
    "numberOfPackages" INTEGER NOT NULL CHECK ('numberOfPackages' >= 0),
    "add_St" TEXT NOT NULL,
    "add_St2" TEXT,
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

CREATE TABLE "Work_For" (
    "hours" INTEGER NOT NULL
);

CREATE TABLE "Post_Office_Loactions" (
    "locationID" TEXT NOT NULL, --Pkey
    "add_St" TEXT NOT NULL,
    "add_St2" TEXT,
    "add_City" TEXT NOT NULL,
    "add_State" TEXT NOT NULL,
    "add_ZipCode" INTEGER NOT NULL,
    "manager" TEXT NOT NULL,    --uses Fkey

    CONSTRAINT "location_pkey" PRIMARY KEY ("locationID"),
    CONSTRAINT "FK_EmployeeManager" FOREIGN KEY ("manager") REFERENCES "Employee"("id")
);

CREATE TABLE "Reveiver_Info" (  --the package that is getting sent to
    "receiver_ID" TEXT NOT NULL, --Pkey
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "add_St" TEXT NOT NULL,
    "add_St2" TEXT,
    "add_State" TEXT NOT NULL,
    "add_ZipCode" INTEGER NOT NULL,

    CONSTRAINT "receiver_pkey" PRIMARY KEY ("receiver_ID")

);

CREATE TABLE "Package" (
    "package_ID" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "sender" TEXT NOT NULL, --refer to Customer account
    "receiver" TEXT NOT NULL, --refer to Reveiver_Info... the id is not made yet
    "status" TEXT, --check constraint need to be added (Accepted, In Transit, Out for Delivery, Unsuccessful Attempts)
    "currentLocation" TEXT NOT NULL, --refer to history
    "createdAt" DATE NOT NULL,
    "createdBy" TEXT NOT NULL, --Employee ID
    "updatedAt" DATE NOT NULL,
    "updatedBy" TEXT NOT NULL, --Employee ID

    CONSTRAINT "package_pkey" PRIMARY KEY ("package_ID"),

);

CREATE TABLE "History" (
    "package_ID" TEXT NOT NULL,
    "originLocation" TEXT NOT NULL,
    "inTransitLocation1" TEXT NOT NULL,
    "inTransitLocation2" TEXT,
    "finalLocation" TEXT NOT NULL,

    CONSTRAINT "FK_Package_ID" FOREIGN KEY ("package_ID") REFERENCES "Package"("package_ID")
);

CREATE TABLE "customerAccount" (
    "customerID" TEXT NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "address" ADDRESS NOT NULL,
    "updatedAt" Date NOT NULL,
    "updatedBy" VARCHAR(30) NOT NULL,
    "createdAt" DATE NOT NULL,

    CONSTRAINT "customerAccount_pkey" PRIMARY KEY ("customerID")
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