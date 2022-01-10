import { redirect } from "remix";
import { db } from "~/utils/db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const position = form.get("position");
  const taskToCreateName = form.get("taskName");
  const taskToToggleId = form.get("taskToToggleId");
  const taskToToggleChecked = form.get("checked") === "true";
  const taskToUpdateId = form.get("taskToUpdateId");
  const taskToUpdateName = form.get("taskToUpdateName");
  const taskToDeleteId = form.get("taskToDelete");
  const taskToDeletePosition = form.get("taskToDeletePosition");
  const actionName = form.get("actionName");
  const taskList = form.get("taskList");
  const parsedTaskList = JSON.parse(taskList);

  const parsedPosition = JSON.parse(position);
  console.log("PARSED STATE ORDER: ", parsedPosition);
  const fields = {
    name: taskToCreateName,
    position: parseInt(position),
  };
  const fixedTasks = (taskToDeletePosition) =>
    taskToDeletePosition.map((task, index) => ({ ...task, position: index }));

  switch (actionName) {
    case "create":
      await db.task.create({ data: fields });
      break;
    case "toggle":
      await db.task.update({
        where: {
          id: taskToToggleId,
        },
        data: {
          isCompleted: taskToToggleChecked,
        },
      });
      break;
    case "update":
      await db.task.update({
        where: {
          id: taskToUpdateId,
        },
        data: {
          name: taskToUpdateName,
        },
      });
      break;
    // case "dnd":
    //   for (let i = 0; i < parsedTaskList.length; i++) {
    //     await db.task.update({
    //       where: {
    //         id: parsedTaskList[i].id,
    //       },
    //       data: {
    //         position: parseInt(parsedPosition[i]),
    //       },
    //     });
    //   }
    //   break;
    case "dnd":
      await Promise.all(
        parsedTaskList.map((parsedTask, i) =>
          db.task.update({
            where: {
              id: parsedTask.id,
            },
            data: {
              position: parseInt(parsedPosition[i], 10),
            },
          })
        )
      );
      break;
    // case "delete":
    //   await db.task.delete({
    //     where: {
    //       id: taskToDeleteId,
    //     },
    //   });
    //   await Promise.all(
    //     fixedTasks.map(({ id, position }) =>
    //       db.task.update({
    //         where: {
    //           id,
    //         },
    //         data: {
    //           position: parseInt(position, 10),
    //         },
    //       })
    //     )
    //   );
    //   break;
    // case "delete":
    //   await db.task.delete({
    //     where: {
    //       id: taskToDeleteId,
    //     },
    //   });
    //   for (let i = 0; i < fixedTasks.length; i++) {
    //     db.task.update({
    //       where: {
    //         id: fixedTasks[i].id,
    //       },
    //       data: {
    //         id: fixedTasks[i].id,
    //         name: fixedTasks[i].name,
    //         position: parseInt(fixedTasks[i].position),
    //         isCompleted: fixedTasks[i].isCompleted,
    //       },
    //     });
    //   }
    //   break;
    default:
      break;
  }
  return redirect("/");
};
