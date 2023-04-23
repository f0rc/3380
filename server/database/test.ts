import { postgresQuery } from "./db";

const createAdmin = async () => {
  const packageList = await postgresQuery(
    `SELECT 
    p.*,
    plh.status,
    plh."processedAt"
FROM "PACKAGE" p
JOIN "PACKAGE_LOCATION_HISTORY" plh
ON p.package_id = plh.package_id
JOIN "CUSTOMER" c_sender
ON p.sender_id = c_sender.customer_id
JOIN "CUSTOMER" c_receiver
ON p.receiver_id = c_receiver.customer_id
WHERE (c_sender.user_id = $1 OR c_receiver.user_id = $1)
AND plh.intransitcounter = (
    SELECT MAX(intransitcounter)
    FROM "PACKAGE_LOCATION_HISTORY"
    WHERE package_id = p.package_id
);`,
    ["0cf3683c-a6a7-4970-ab6a-53b1768601e9"]
  );

  console.log(packageList);
};

createAdmin();
