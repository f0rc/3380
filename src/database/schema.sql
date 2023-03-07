
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Company"{
"Name" TEXT NOT NULL,
"totalPostOfficeLocations" INTEGER NOT NULL,
"totalEmployees" INTEGER NOT NULL,
"totalCustomer" INTEGER NOT NULL,
"totalRevenue" INTEGER NOT NULL,
"totalPaidSalary" INTEGER NOT NULL,
"profit" INTEGER NOT NULL,
"createdAt" DATE NOT NULL, 
"updatedAt" DATE NOT NULL
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
