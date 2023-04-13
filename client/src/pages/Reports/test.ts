import { faker } from "@faker-js/faker";

export type PackageFakeData = {
  package: string;
  sender: string;
  receiver: string;
  type: "Box" | "Package" | "Envelope";
  weight: number;
  size: "Small" | "Medium" | "Large";
  lastupdated: string;
  status: "In Transit" | "Delivered" | "Returned";
  subRows?: PackageFakeData[];
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): PackageFakeData => {
  return {
    package: faker.datatype.uuid(),
    sender: faker.internet.email(),
    receiver: faker.internet.email(),
    type: faker.helpers.shuffle<PackageFakeData["type"]>([
      "Box",
      "Package",
      "Envelope",
    ])[0]!,
    weight: faker.datatype.number(40),
    size: faker.helpers.shuffle<PackageFakeData["size"]>([
      "Small",
      "Medium",
      "Large",
    ])[0]!,
    lastupdated: faker.date.past().toDateString(),
    status: faker.helpers.shuffle<PackageFakeData["status"]>([
      "In Transit",
      "Delivered",
      "Returned",
    ])[0]!,
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): PackageFakeData[] => {
    const len = lens[depth]!;
    return range(len).map((d): PackageFakeData => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
