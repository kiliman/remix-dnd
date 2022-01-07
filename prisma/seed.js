import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getTasks().map((task) => {
      return db.task.create({ data: task });
    })
  );
}

seed();

function getTasks() {
  return [
    {
      id: "9sd8f7",
      index: "0",
      name: "Task Five",
      isCompleted: false,
    },
    {
      id: "79s8d",
      index: "1",
      name: "Task Two",
      isCompleted: true,
    },
    {
      id: "6f7sd",
      index: "2",
      name: "Task Three",
      isCompleted: false,
    },
    {
      id: "gh8f76",
      index: "3",
      name: "Task Four",
      isCompleted: true,
    },
  ];
}
