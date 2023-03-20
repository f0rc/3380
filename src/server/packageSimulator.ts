import { postgresQuery } from "src/database/db";

export interface PackageType {
  locationHistoryID: number;
  package_location_id: number;
  package_id: string;
  status: string;
  location_id: number;
  intransitcounter: number;
}
export interface PackageListType {
  package_id: string;
  id: number;
  status: string[];
  zipcodeHistory: string[];
  inTransitCounter: number;
}

const getPackages = async () => {
  try {
    const packages = await postgresQuery(
      `SELECT *
      FROM "PACKAGE_LOCATION_HISTORY"
      WHERE "package_id" = (
        SELECT "package_id"
        FROM "PACKAGE_LOCATION_HISTORY"
        WHERE "status" IN ('accepted', 'transit', 'out-for-delivery')
        AND "package_id" NOT IN (
          SELECT "package_id"
          FROM "PACKAGE_LOCATION_HISTORY"
          WHERE "status" IN ('fail', 'delivered')
        )
        ORDER BY "processedAt" ASC
        LIMIT 1
      )
      ORDER BY "processedAt" ASC
      LIMIT 10;`,
      []
    );

    return packages.rows as PackageType[];
  } catch (e) {
    console.log(e);
  }
};

const updatePackage = async ({
  package_id,
  location_id,
  status,
  intransitcounter,
}: {
  package_id: string;
  location_id: string;
  status: string;
  intransitcounter: number;
}) => {
  try {
    const packages = await postgresQuery(
      `INSERT INTO "PACKAGE_LOCATION_HISTORY" ("package_id", "status", "location_id", "intransitcounter") VALUES ($1, $2, $3, $4);`,
      [package_id, status, location_id, intransitcounter]
    );

    return packages.rows as PackageType[];
  } catch (e) {
    console.log(e);
  }
};

const canTransit = (inTransitCounter: number) => {
  if (inTransitCounter === 1) {
    const change = Math.random() < 0.8;
    console.log("CHANCE is 80%");
    return change;
  } else if (inTransitCounter === 2) {
    const change = Math.random() < 0.6;
    console.log("CHANCE is 60%");
    return change;
  } else if (inTransitCounter === 3) {
    const change = Math.random() < 0.4;
    console.log("CHANCE is 40%");
    return change;
  } else if (inTransitCounter === 4) {
    const change = Math.random() < 0.2;
    console.log("CHANCE is 20%");
    return change;
  }
};

const getRandomOfficeLocation = (zipcodeHistory: string[]): string => {
  // ##TODO: GET ACTUAL OFFICE LOCATIONS
  const postofficelocations = [
    "10001",
    "60601",
    "80202",
    "94102",
    "90001",
    "120312",
    "23423",
    "901723",
    "788456",
    "5695745",
  ];
  const randomLocation =
    postofficelocations[Math.floor(Math.random() * postofficelocations.length)];
  if (zipcodeHistory.includes(randomLocation!)) {
    return getRandomOfficeLocation(zipcodeHistory);
  }

  return randomLocation as string;
};

async function simulatePackageDelivery(pkg: PackageListType) {
  const postofficelocations = ["10001", "60601", "80202", "94102", "90001"];

  const randomLocation =
    postofficelocations[Math.floor(Math.random() * postofficelocations.length)];

  if (pkg.status[pkg.status.length - 1] === "delivered") {
    return;
  }
  const isDeliveryFailed = Math.random() < 0.01;

  if (
    pkg.status[pkg.status.length - 1] === "transit" &&
    pkg.zipcodeHistory.length >= 2 &&
    pkg.inTransitCounter >= 4
  ) {
    await updatePackage({
      package_id: pkg.package_id,
      location_id: randomLocation!,
      status: "out-for-delivery",
      intransitcounter: pkg.inTransitCounter,
    });
    // pkg.zipcodeHistory.push(randomLocation!);
    // pkg.status.push("out-for-delivery");
  } else if (
    pkg.status[pkg.status.length - 1] === "transit" &&
    pkg.zipcodeHistory.length >= 2 &&
    pkg.inTransitCounter <= 4
  ) {
    if (canTransit(pkg.inTransitCounter)) {
      await updatePackage({
        package_id: pkg.package_id,
        location_id: randomLocation!,
        status: "transit",
        intransitcounter: pkg.inTransitCounter + 1,
      });
      // pkg.zipcodeHistory.push(randomLocation!);
      // pkg.status.push("transit");
      // pkg.inTransitCounter++;
    } else {
      await updatePackage({
        package_id: pkg.package_id,
        location_id: randomLocation!,
        status: "out-for-delivery",
        intransitcounter: pkg.inTransitCounter,
      });
      // pkg.zipcodeHistory.push(randomLocation!);
      // pkg.status.push("out-for-delivery");
    }
  } else if (pkg.status[pkg.status.length - 1] === "out-for-delivery") {
    if (isDeliveryFailed) {
      await updatePackage({
        package_id: pkg.package_id,
        location_id: pkg.zipcodeHistory[pkg.zipcodeHistory.length - 1]!,
        status: "fail",
        intransitcounter: pkg.inTransitCounter,
      });
      // pkg.status.push("failed-delivery");
    } else {
      await updatePackage({
        package_id: pkg.package_id,
        location_id: pkg.zipcodeHistory[pkg.zipcodeHistory.length - 1]!,
        status: "delivered",
        intransitcounter: pkg.inTransitCounter,
      });
      // pkg.zipcodeHistory.push(randomLocation!);
      // pkg.status.push("delivered");
    }
  } else if (
    pkg.status[pkg.status.length - 1] === "accepted" &&
    pkg.zipcodeHistory.length === 1
  ) {
    await updatePackage({
      package_id: pkg.package_id,
      location_id: randomLocation!,
      status: "transit",
      intransitcounter: pkg.inTransitCounter + 1,
    });
    // pkg.zipcodeHistory.push(randomLocation!);
    // pkg.status.push("transit");
    // pkg.inTransitCounter = 1;
  } else if (pkg.status[pkg.status.length - 1] === "accepted") {
    await updatePackage({
      package_id: pkg.package_id,
      location_id: randomLocation!,
      status: "transit",
      intransitcounter: pkg.inTransitCounter + 1,
    });
    // pkg.zipcodeHistory.push(randomLocation!);
    // pkg.status.push("transit");
    // pkg.inTransitCounter = 1;
  }
}

const simulate = async () => {
  const dbpkg = await getPackages();

  if (!dbpkg) {
    return;
  }

  const statusList = dbpkg.map((pkg) => pkg.status);
  const zipcodelist = dbpkg.map((pkg) => pkg.location_id.toString());

  const packageList = {
    package_id: dbpkg[0]!.package_id,
    id: dbpkg[0]!.package_location_id,
    status: statusList,
    zipcodeHistory: zipcodelist,
    inTransitCounter: dbpkg[dbpkg.length - 1]!.intransitcounter,
  };

  await simulatePackageDelivery(packageList);
};

simulate();
