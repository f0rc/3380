
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

CREATE TYPE position AS ENUM ('N/A','Manager', 'Clerk');

CREATE TABLE "Employee" (
    "ID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "revenue" INTEGER NOT NULL,
    "role" position DEFAULT 'N/A',
    "salary" INT NOT NULL,
    "numberOfPackages" INT NOT NULL
    "address" ADDRESS NOT NULL,
    "startDate" DATE NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,

    PRIMARY KEY (ID)
);

CREATE 