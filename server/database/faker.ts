import { faker } from "@faker-js/faker";
import { postgresQuery } from "./db";

const createFakePackages = async (numberOfPackages = 100) => {
  for (let i = 0; i < numberOfPackages; i++) {
    try {
      console.log(`Creating package ${i + 1}...`);
      const date = faker.date.past(); // createdAt
      const makePackage = await postgresQuery(
        `INSERT INTO "PACKAGE" ("package_id", "cost", "sender_id", "receiver_id", "weight", "type", "size", "createdBy", "updatedBy", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          faker.datatype.uuid(), // package_id
          faker.datatype.number({ min: 0, max: 2000 }), // cost
          "00e16ab8-61c4-4d0e-88fb-31bc1560b0f4", // senderID
          "c7713bc4-91e1-4d2a-a9f1-45812f265832", // receiverID
          faker.datatype.float({ min: 0.1, max: 50 }), // weight

          faker.helpers.arrayElement(["box", "envelope"]), // type
          faker.helpers.arrayElement(["small", "medium", "large"]), // size
          "5c01f46f-5373-4b24-985a-e9e23f4e446c", // employeeID // createdBy
          "5c01f46f-5373-4b24-985a-e9e23f4e446c", // employeeID // updatedBy
          date, // createdAt
          date,
        ]
      );
    } catch (error) {
      console.log(`Error creating package ${i + 1}:`, error);
    }
  }
};

createFakePackages(100);
