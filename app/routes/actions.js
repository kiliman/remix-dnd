import { redirect } from "remix";
import { db } from "~/utils/db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const taskList = form.get("taskList");
  const parsedTaskList = JSON.parse(taskList);
  const taskToCreateName = form.get("taskName");
  const taskToToggleId = form.get("taskToToggleId");
  const taskToToggleChecked = form.get("checked") === "true";
  const taskToUpdateId = form.get("taskToUpdateId");
  const taskToUpdateName = form.get("taskToUpdateName");
  const taskToDeleteId = form.get("taskToDelete");
  const actionName = form.get("actionName");

  console.log("CURRENT TASK: ", parsedTaskList[0].name);

  for (let i = 0; i < parsedTaskList.length; i++) {
    await db.task.update({
      where: {
        id: parsedTaskList[i].id,
      },
      data: {
        position: parsedTaskList[i].position,
        name: parsedTaskList[i].name,
        isCompleted: parsedTaskList[i].isCompleted,
      },
    });
  }

  return redirect("/");
};

switch (actionName) {
  case "create":
    const fields = { name: taskToCreateName };
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
  case "dnd":
    for (let i = 0; i < parsedTaskList.length; i++) {
      await db.task.update({
        where: {
          id: parsedTaskList[i].id,
        },
        data: {
          position: parsedTaskList[i].position,
          name: parsedTaskList[i].name,
          isCompleted: parsedTaskList[i].isCompleted,
        },
      });
    }
    break;
  case "delete":
    await db.task.delete({
      where: {
        id: taskToDeleteId,
      },
    });
    break;
  default:
    break;
}
return redirect("/");
};
