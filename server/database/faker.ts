import { faker } from "@faker-js/faker";
import { postgresQuery } from "./db";
import { randomUUID } from "crypto";

function generateOneWordBuildingName() {
  const buildingPrefixes = [
    "Aqua",
    "Terra",
    "Sky",
    "Crystal",
    "Solar",
    "Luna",
    "Astro",
    "Cosmo",
    "Eco",
    "Geo",
    "Magna",
    "Meteora",
    "Nimbus",
    "Oceana",
    "Plex",
    "Regalia",
    "Strata",
    "Tribeca",
    "Vista",
    "Zephyr",
  ];

  const buildingSuffixes = [
    "Tower",
    "Plaza",
    "Center",
    "Point",
    "Heights",
    "Lofts",
    "Court",
    "Place",
    "Square",
    "Terrace",
    "Gardens",
    "Residences",
    "Haven",
    "Mansion",
    "Crest",
    "Palace",
    "Village",
    "Row",
    "Station",
    "Crossing",
  ];

  const prefix = faker.helpers.arrayElement(buildingPrefixes);
  const suffix = faker.helpers.arrayElement(buildingSuffixes);

  return prefix + " " + suffix;
}

const createFakeLocations = async (numberOfLocations = 20) => {
  for (let i = 0; i < numberOfLocations; i++) {
    const date = faker.date.past().toLocaleDateString(); // createdAt
    console.log("date", date);
    try {
      console.log(`Creating location ${i + 1}...`);
      const location = await postgresQuery(
        `INSERT INTO "POSTOFFICE_LOCATION" (
          "postoffice_location_id", 
          "locationname", 
          "address_street", 
          "address_city", 
          "address_state", 
          "address_zipcode",
          "createdAt",
          "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          faker.datatype.uuid(),
          generateOneWordBuildingName(),
          faker.address.streetAddress(),
          faker.address.city(),
          "TX",
          faker.address.zipCodeByState("TX").split("-")[0],
          date,
          date,
        ]
      );
    } catch (error) {
      console.log(`Error creating location ${i + 1}:`, error);
    }
  }
};

const createFakeManagers = async (numberOfManagers = 10) => {
  const managerId = await postgresQuery(
    `SELECT "employee_id" FROM "EMPLOYEE" WHERE "role" = 4`,
    []
  );

  const locations = await postgresQuery(
    `SELECT "postoffice_location_id" FROM "POSTOFFICE_LOCATION"`,
    []
  );
  const locationIDs = locations.rows.map(
    (location) => location.postoffice_location_id
  );
  locations.rows.forEach(async (location) => {
    const date = faker.date.past(); // createdAt
    try {
      const empUUID = faker.datatype.uuid();
      const manager = await postgresQuery(
        `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "manager_id", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          empUUID, //##TODO: make this a uuid in the db automatically
          faker.internet.email(),
          faker.name.firstName(),
          faker.name.lastName(),
          faker.date.birthdate(),
          3,
          faker.datatype.number({ min: 10000, max: 100000 }),
          managerId.rows[0].employee_id, // manager id
          // input.locationID,

          faker.address.streetAddress(),
          faker.address.city(),
          "TX",
          faker.address.zipCodeByState("TX").split("-")[0],
          date,
          managerId.rows[0].employee_id,
          managerId.rows[0].employee_id,
          date,
          date,
        ]
      );

      const workLocation = location.postoffice_location_id;

      const dbCreateWorksFor = await postgresQuery(
        `INSERT INTO "WORKS_FOR" ("employee_id", "postoffice_location_id") VALUES ($1, $2)`,
        [empUUID, workLocation]
      );

      const updateLocation = await postgresQuery(
        `UPDATE "POSTOFFICE_LOCATION" SET "postoffice_location_manager" = $1 WHERE "postoffice_location_id" = $2`,
        [empUUID, workLocation]
      );
    } catch (error) {
      console.log(`Error creating manager:`, error);
    }
  });
};

const createFakeEmployees = async (numberOfManagers = 10) => {
  const getManagers = await postgresQuery(
    `SELECT "employee_id" FROM "EMPLOYEE" WHERE "role" = 3`,
    []
  );

  // console.log("getManagers", getManagers.rows);
  const managerIDs = getManagers.rows.map((manager) => manager.employee_id);

  const roles = [1, 2];

  managerIDs.forEach(async (managerID) => {
    for (let i = 0; i < Math.floor(Math.random() * numberOfManagers); i++) {
      const date = faker.date.past(); // createdAt
      try {
        const empUUID = faker.datatype.uuid();

        const manager = await postgresQuery(
          `INSERT INTO "EMPLOYEE" ("employee_id", "email","firstname", "lastname", "birthdate", "role", "salary", "manager_id", "address_street", "address_city", "address_state", "address_zipcode", "startdate" , "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            empUUID, //##TODO: make this a uuid in the db automatically
            faker.internet.email(),
            faker.name.firstName(),
            faker.name.lastName(),
            faker.date.birthdate(),
            faker.helpers.arrayElement(roles),
            faker.datatype.number({ min: 10000, max: 100000 }),
            managerID,
            // input.locationID,

            faker.address.streetAddress(),
            faker.address.city(),
            "TX",
            faker.address.zipCodeByState("TX").split("-")[0],
            date,
            managerID,
            managerID,
            date,
            date,
          ]
        );

        const getManagerlocations = await postgresQuery(
          `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
          [managerID]
        );
        const dbCreateWorksFor = await postgresQuery(
          `INSERT INTO "WORKS_FOR" ("employee_id", "postoffice_location_id") VALUES ($1, $2)`,
          [empUUID, getManagerlocations.rows[0].postoffice_location_id]
        );
      } catch (error) {
        console.log(`Error creating manager`, error);
      }
    }
  });
};

const createFakeCustomers = async (numberOfCustomers = 10) => {
  const date = faker.date.past(); // createdAt
  for (let i = 0; i < numberOfCustomers; i++) {
    try {
      console.log(`Creating customer ${i + 1}...`);
      const customer = await postgresQuery(
        `INSERT INTO "CUSTOMER" ("customer_id", "firstname", "lastname", "email", "phoneNumber", "address_street", "address_city", "address_state", "address_zipcode", "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          faker.datatype.uuid(), // customer_id
          faker.name.firstName(),
          faker.name.lastName(),
          faker.internet.email(),
          faker.phone.number(),
          faker.address.streetAddress(),
          faker.address.city(),
          "TX",
          faker.address.zipCodeByState("TX").split("-")[0],
          "5c01f46f-5373-4b24-985a-e9e23f4e446c",
          "5c01f46f-5373-4b24-985a-e9e23f4e446c",
          date,
          date,
        ]
      );
    } catch (error) {
      console.log(`Error creating customer ${i + 1}:`, error);
    }
  }
};

const createFakePackages = async (numberOfPackages = 100) => {
  const getCustomers = await postgresQuery(
    `SELECT "customer_id" FROM "CUSTOMER"`,
    []
  );

  const customerIDs = getCustomers.rows.map((customer) => customer.customer_id);

  const getCustomerId = (senderid: string): any => {
    const randomIndex = Math.floor(Math.random() * customerIDs.length);
    const customerId = customerIDs[randomIndex];
    if (customerId === senderid) {
      return getCustomerId(senderid);
    }

    return customerId;
  };

  const getEmployees = await postgresQuery(
    `SELECT "employee_id" FROM "EMPLOYEE" WHERE "role" = 2`,
    []
  );

  const employeeIDs = getEmployees.rows.map((employee) => employee.employee_id);

  for (let i = 0; i < numberOfPackages; i++) {
    try {
      const senderID = faker.helpers.arrayElement(customerIDs);
      const employee = faker.helpers.arrayElement(employeeIDs);
      const pkgId = faker.datatype.uuid();

      console.log(`Creating package ${i + 1}...`);
      const date = faker.date.past(); // createdAt
      const makePackage = await postgresQuery(
        `INSERT INTO "PACKAGE" ("package_id", "cost", "sender_id", "receiver_id", "weight", "type", "size", "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          pkgId, // package_id
          faker.datatype.number({ min: 0, max: 2000 }), // cost
          senderID, // senderID
          getCustomerId(senderID), // receiverID
          faker.datatype.float({ min: 0.1, max: 50 }), // weight

          faker.helpers.arrayElement(["box", "envelope"]), // type
          faker.helpers.arrayElement(["small", "medium", "large"]), // size
          employee, // employeeID // createdBy
          employee, // employeeID // updatedBy
          date, // createdAt
          date,
        ]
      );

      const clerkLocationDB = await postgresQuery(
        `SELECT "postoffice_location_id" FROM "WORKS_FOR" WHERE "employee_id" = $1`,
        [employee]
      );

      const clerkLocation = clerkLocationDB.rows[0].postoffice_location_id;
      console.log("MNO", clerkLocation);

      const makePackageLocationHistory = await postgresQuery(
        `INSERT INTO "PACKAGE_LOCATION_HISTORY" ("package_id", "postoffice_location_id", "status", 
        "processedBy", "processedAt") VALUES ($1, $2, $3, $4, $5)`,
        [
          pkgId, // package_id
          clerkLocation, // postoffice_location_id // clerk location
          "accepted",
          employee, // employeeID // createdBy
          date,
        ]
      );
    } catch (error) {
      console.log(`Error creating package ${i + 1}:`, error);
    }
  }
};

const createFakeLogHours = async (numberOfHours = 100) => {
  const getEmployees = await postgresQuery(
    `SELECT "employee_id" FROM "EMPLOYEE"`,
    []
  );

  const employeeIDs = getEmployees.rows.map((employee) => employee.employee_id);

  for (let i = 0; i < numberOfHours; i++) {
    try {
      const employee = faker.helpers.arrayElement(employeeIDs);
      console.log(`Creating hours ${i + 1}...`);
      const date = faker.date.past(); // createdAt
      const makeHours = await postgresQuery(
        `INSERT INTO "WORK_LOG" ("employee_id", "hours", "date") VALUES ($1, $2, $3)`,
        [
          employee, // employeeID
          faker.datatype.number({ min: 1, max: 24 }), // hours
          date, // employeeID // createdBy
        ]
      );
    } catch (error) {
      console.log(`Error creating hours ${i + 1}:`, error);
    }
  }
};

const productsList = [
  {
    name: "Duck Tape",
    image: "images/5ed90d5e-456d-4844-9c61-da5b98788d33.png",
    discription: "Very Cool Duck Tape",
    price: 10.99,
  },
  {
    name: "Cardboard Box",
    image: "images/5048933fc84ed718f592e4df088aac8.png",
    discription: "Very Cool Cardboard Box",
    price: 25.99,
  },
  {
    name: "Envelope",
    image: "images/149fbd2c960a71c0f36f7cfa1b8f40ab.png",
    discription: "Very Cool Envelope",
    price: 5.99,
  },
  {
    name: "Bubble Wrap",
    image: "images/59c2e60b9cdf64bcac32c01fd5eb131a.png",
    discription: "Very Cool Bubble Wrap",
    price: 15.99,
  },
  {
    name: "Manila Envelope",
    image: "images/fa84bd01-ad25-4a81-89bf-c057eb8e221b.png",
    discription: "Very Cool Manila Envelope",
    price: 10.99,
  },
  {
    name: "Packing Sticker",
    image: "images/1ab1b493-76cf-4447-965e-79e97c4fd3de.png",
    discription: "Very Cool Packing Sticker",
    price: 5.99,
  },
];

// const createFakeOrders = async (numberOfOrders = 100) => {
//   const getCustomers = await postgresQuery(
//     `SELECT "customer_id" FROM "CUSTOMER"`,
//     []
//   );

//   const customerIDs = getCustomers.rows.map((customer) => customer.customer_id);

//   const getEmployees = await postgresQuery(
//     `SELECT "employee_id" FROM "EMPLOYEE"`,
//     []
//   );

//   const employeeIDs = getEmployees.rows.map((employee) => employee.employee_id);

//   for (let i = 0; i < numberOfOrders; i++) {
//     try {
//       const customer = faker.helpers.arrayElement(customerIDs);
//       const employee = faker.helpers.arrayElement(employeeIDs);

//       const getProducts = await postgresQuery(
//         `SELECT "product_id", "price"  FROM "PRODUCT"`,
//         []
//       );

//       console.log(`Creating order ${i + 1}...`);
//       const date = faker.date.past(); // createdAt
//       const products = getProducts.rows;
//       const productsList = [];
//       const numberOfProducts = faker.datatype.number({ min: 1, max: 5 });
//       for (let i = 0; i < numberOfProducts; i++) {
//         const product = faker.helpers.arrayElement(products);
//         productsList.push(product);
//       }

//       console.log(productsList);

//       // // make a fake order with at least 2 random products from the getProducts query and sum up the price of the products to get the total price

//       const orderTotal = productsList.reduce((acc, product) => {
//         return acc + Number(product.price);
//       }, 0);

//       console.log(orderTotal);

//       // const makeOrder = await postgresQuery(
//       //   `INSERT INTO "ORDER" ("customer_id", "employee_id", "total_price", "createdBy", "createdAt", "updatedBy", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//       //   [
//       //     customer, // customerID
//       //     employee, // employeeID
//       //     faker.datatype.number({ min: 1, max: 1000 }), // total_price
//       //     employee, // employeeID // createdBy
//       //     date, // createdAt
//       //     employee, // employeeID // updatedBy
//       //     date, // updatedAt
//       //   ]
//       // );

//       // const order_id = makeOrder.rows[0].order_id;

//       // const orderProducts = productsList.map(async (product) => {
//       //   const orderProduct = await postgresQuery(
//       //     `INSERT INTO "ORDER_ITEMS" ("order_id", "product_id", "quantity", "price") VALUES ($1, $2, $3, $4)`,
//       //     [
//       //       order_id,
//       //       faker.datatype.number({ min: 1, max: 6 }),
//       //       faker.datatype.number({ min: 1, max: 10 }),
//       //       product.price,
//       //     ]
//       //   );
//       // });
//     } catch (error) {
//       console.log(`Error creating order ${i + 1}:`, error);
//     }
//   }
// };

const main = async () => {
  await createFakeLocations(6);
  await createFakeManagers(6);
  await createFakeEmployees(20);
  await createFakeCustomers(50);
  await createFakeLogHours(500);
  await createFakePackages(20);
  // await createFakeOrders(20);
};

main();
