export interface PackageList {
  id: string;
  status: [
    | "intransit"
    | "accepted"
    | "delivered"
    | "out-for-delivery"
    | "failed-delivery"
  ];
  zipcodeHistory: string[];
  inTransitCounter: number | 0;
}

interface PackageType {
  pkgID: number;
  id: number;
  status: string;
  currentZip: number;
  intransitCounter: number;
}

const onePackage: PackageType[] = [
  {
    pkgID: 2,
    id: 1,
    status: "accepted",
    currentZip: 100,
    intransitCounter: 0,
  },
  // {
  //   pkgID: 2,
  //   id: 2,
  //   status: "intransit",
  //   currentZip: 200,
  //   intransitCounter: 1,
  // },
  // {
  //   pkgID: 2,
  //   id: 3,
  //   status: "intransit",
  //   currentZip: 623,
  //   intransitCounter: 2,
  // },
  // {
  //   pkgID: 2,
  //   id: 4,
  //   status: "intransit",
  //   currentZip: 890,
  //   intransitCounter: 3,
  // },
  // {
  //   pkgID: 2,
  //   id: 5,
  //   status: "out-for-delivery",
  //   currentZip: 1231,
  //   intransitCounter: 3,
  // },
  // {
  //   pkgID: 2,
  //   id: 6,
  //   status: "delivered",
  //   currentZip: 91723,
  //   intransitCounter: 3,
  // },
];

const statusList = onePackage.map((pkg) => pkg.status);
const zipcodelist = onePackage.map((pkg) => pkg.currentZip.toString());

const packageList = [
  {
    id: onePackage[0]?.id,
    status: statusList,
    zipcodeHistory: zipcodelist,
    inTransitCounter: onePackage[onePackage.length - 1]?.intransitCounter || 0,
  },
];

console.log(packageList);

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

function simulatePackageDelivery(packages: PackageType[]) {
  const postofficelocations = ["10001", "60601", "80202", "94102", "90001"];
  packageList.forEach((pkg) => {
    const randomLocation =
      postofficelocations[
        Math.floor(Math.random() * postofficelocations.length)
      ];

    if (pkg.status[pkg.status.length - 1] === "delivered") {
      return;
    }
    const isDeliveryFailed = Math.random() < 0.05;

    if (
      pkg.status[pkg.status.length - 1] === "intransit" &&
      pkg.zipcodeHistory.length >= 2 &&
      pkg.inTransitCounter >= 4
    ) {
      pkg.zipcodeHistory.push(randomLocation!);
      pkg.status.push("out-for-delivery");
      pkg.inTransitCounter = 0;
    } else if (
      pkg.status[pkg.status.length - 1] === "intransit" &&
      pkg.zipcodeHistory.length >= 2 &&
      pkg.inTransitCounter <= 4
    ) {
      if (canTransit(pkg.inTransitCounter)) {
        pkg.zipcodeHistory.push(randomLocation!);
        pkg.status.push("intransit");
        pkg.inTransitCounter++;
      } else {
        pkg.zipcodeHistory.push(randomLocation!);
        pkg.status.push("out-for-delivery");
      }
    } else if (pkg.status[pkg.status.length - 1] === "out-for-delivery") {
      if (isDeliveryFailed) {
        pkg.status.push("failed-delivery");
        console.log(`Delivery failed for package ${pkg.id}`);
      } else {
        pkg.zipcodeHistory.push(randomLocation!);
        pkg.status.push("delivered");
        console.log(`Package ${pkg.id} delivered to`);
      }
    } else if (
      pkg.status[pkg.status.length - 1] === "accepted" &&
      pkg.zipcodeHistory.length === 1
    ) {
      pkg.zipcodeHistory.push(randomLocation!);
      pkg.status.push("intransit");
      pkg.inTransitCounter = 1;
    } else if (pkg.status[pkg.status.length - 1] === "accepted") {
      pkg.zipcodeHistory.push(randomLocation!);
      pkg.status.push("intransit");
      pkg.inTransitCounter = 1;
    }
  });
}

simulatePackageDelivery(onePackage);
simulatePackageDelivery(onePackage);
simulatePackageDelivery(onePackage);
simulatePackageDelivery(onePackage);
simulatePackageDelivery(onePackage);
simulatePackageDelivery(onePackage);
packageList.forEach((pkg) => {
  console.log("++++++++++++++++++++++++++++++");
  console.log("package id: ", pkg.id);
  console.log("status: ", pkg.status);
  console.log("zipcode history: ", pkg.zipcodeHistory);
  console.log("transits: ", pkg.inTransitCounter);
  console.log("++++++++++++++++++++++++++++++");
});
// }
