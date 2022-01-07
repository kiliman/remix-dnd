import { redirect } from "remix";
import { db } from "~/utils/db.server";

export const action = async ({ request }) => {
  const form = await request.formData();
  const taskList = form.get("taskList");
  const subaction = form.get("subaction");
  const parsedTaskList = JSON.parse(taskList);

  console.log("CURRENT TASK: ", parsedTaskList[0].name);

  for (let i = 0; i < parsedTaskList.length; i++) {
    await db.task.update({
      where: {
        id: parsedTaskList[i].id,
      },
      data: {
        index: parsedTaskList[i].index,
        name: parsedTaskList[i].name,
        isCompleted: parsedTaskList[i].isCompleted,
      },
    });
  }

  return redirect("/");
};
