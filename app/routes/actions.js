import { redirect } from "remix";
import { db } from "~/utils/db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const actionName = form.get("actionName");

  switch (actionName) {
    case "create":
      {
        const name = form.get("name");
        const position = parseInt(form.get("position"), 10);
        await db.task.create({ data: { name, position } });
      }
      break;
    case "toggle":
      {
        const id = form.get("id");
        const isCompleted = form.get("isCompleted") === "true";
        const updated = await db.task.update({
          where: {
            id,
          },
          data: {
            isCompleted,
          },
        });
      }
      break;
    case "update":
      {
        const id = form.get("id");
        const name = form.get("name");

        await db.task.update({
          where: {
            id,
          },
          data: {
            name,
          },
        });
      }
      break;
    case "dnd":
      {
        const taskIds = form.get("taskIds").split(",");
        for (let i = 0; i < taskIds.length; i++) {
          let id = taskIds[i];
          await db.task.update({
            where: {
              id,
            },
            data: {
              position: i,
            },
          });
        }
      }
      break;
    case "delete":
      {
        const id = form.get("id");
        await db.task.delete({
          where: {
            id,
          },
        });
        const taskIds = (
          await db.task.findMany({
            select: {
              id: true,
            },
            orderBy: {
              position: "asc",
            },
          })
        ).map((task) => task.id);
        for (let i = 0; i < taskIds.length; i++) {
          let id = taskIds[i];
          await db.task.update({
            where: {
              id,
            },
            data: {
              position: i,
            },
          });
        }
      }
      break;
    default:
      throw new Response(`Unknown action ${actionName}`, { status: 400 });
  }
  return redirect("/");
};
