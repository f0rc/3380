// import { postgresQuery } from "src/database/db";

// // package simulations:
// // 1. get packages every 10 seconds
// // 2.update: {
// //
// // }

// export const getPackage = async () => {
//   // select packages 10 at a time where status is == accepted and in transit
//   const getPackage = await postgresQuery(
//     `select * from "Package_Location_History" where "status" = $1 OR "status" = $2 limit 10`,
//     ["Accepted", "In Transit"]
//   );
//   console.log(getPackage.rows);
// };

export interface Package {
  id: string;
  status: "intransit" | "accepted" | "delivered";
  originZip: string;
  destinationZip: string;
  currentZip: string;
}
function simulatePackageDelivery(packages: Package[]) {
  const zipCodes = ["10001", "60601", "80202", "94102", "90001"];

  setInterval(() => {
    packages.forEach((pkg) => {
      if (pkg.status === "intransit") {
        const currentZipIndex = zipCodes.indexOf(pkg.currentZip);
        const destZipIndex = zipCodes.indexOf(pkg.destinationZip);

        // Find the closest zip code to the current location
        const distancesToCurrentZip = zipCodes.map((zip) => {
          const distance = Math.abs(zipCodes.indexOf(zip) - currentZipIndex);
          return { zip, distance };
        });
        const sortedByDistanceToCurrentZip = distancesToCurrentZip.sort(
          (a, b) => a.distance - b.distance
        );
        const closestZipToCurrent = sortedByDistanceToCurrentZip[0].zip;

        // Find the closest zip code to the destination
        const distancesToDestZip = zipCodes.map((zip) => {
          const distance = Math.abs(zipCodes.indexOf(zip) - destZipIndex);
          return { zip, distance };
        });
        const sortedByDistanceToDestZip = distancesToDestZip.sort(
          (a, b) => a.distance - b.distance
        );
        const closestZipToDest = sortedByDistanceToDestZip[0].zip;

        // Pick the closest zip code that is also closer to the destination
        const possibleNextZips = [closestZipToCurrent, closestZipToDest];
        let nextZip = "";
        for (const zip of possibleNextZips) {
          if (zip !== pkg.currentZip) {
            nextZip = zip;
            break;
          }
        }
        pkg.currentZip = nextZip;
        console.log(`Package ${pkg.id} is now in zip code ${nextZip}.`);

        // Check if the package has arrived at its destination
        if (pkg.currentZip === pkg.destinationZip) {
          pkg.status = "delivered";
          console.log(
            `Package ${pkg.id} has been delivered to zip code ${pkg.destinationZip}!`
          );
        }
      }
    });
  }, 5000);
}
const packages: Package[] = [
  {
    id: "pkg001",
    status: "intransit",
    originZip: "10001",
    destinationZip: "90001",
    currentZip: "10001",
  },
  {
    id: "pkg002",
    status: "intransit",
    originZip: "94102",
    destinationZip: "60601",
    currentZip: "80202",
  },
];

simulatePackageDelivery(packages);
