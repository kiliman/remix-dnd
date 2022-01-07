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
      position: 1,
      name: "Task Five",
      isCompleted: false,
    },
    {
      position: 2,
      name: "Task Two",
      isCompleted: true,
    },
    {
      position: 3,
      name: "Task Three",
      isCompleted: false,
    },
    {
      position: 4,
      name: "Task Four",
      isCompleted: true,
    },
  ];
}
