
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Company"{
"id"
}

CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,  
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "birthDate" DATE NOT NULL,
    "revenue" INTEGER NOT NULL CHECK (revenue >= 0),
    "role" TEXT CHECK (role == 'Manager' || role == 'Clerk'),
    "salary" INT NOT NULL CHECK (salary >= 0),
    "numberOfPackages" INT NOT NULL CHECK ('numberOfPackages' >= 0),
    "address" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(30) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR(30) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Work_For" (
    "hours" int NOT NULL
);
