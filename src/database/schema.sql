
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Company"{
    "name" VARCHAR(255) NOT NULL,
    "totalPostOfficeLocations" INTEGER NOT NULL CHECK (totalPostOfficeLocations>=0),
    "totalEmployees" INTEGER NOT NULL CHECK (totalEmployees>=0),
    "totalCustomer" INTEGER NOT NULL CHECK (totalCustomer>=0),
    "totalRevenue" INTEGER NOT NULL CHECK (totalRevenue>=0),
    "totalPaidSalary" INTEGER NOT NULL CHECK (totalPaidSalary>=0),
    "profit" INTEGER NOT NULL CHECK (profit>=0),
    "createdAt" TIMESTAMP(3) NOT NULL, 
    "updatedAt" TIMESTAMP(3) NOT NULL
};


CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
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
