import type { Task } from "@prisma/client";
import { useTransition } from "remix";
import TaskItem from "./TaskItem";

type ListProp = { tasks: Task[] };

function TaskList({ tasks }: ListProp) {
  const transition = useTransition();

  const optimisticTasks =
    transition.submission && transition.submission.action === "/?index"
      ? [
          ...tasks,
          {
            ...Object.fromEntries(transition.submission.formData.entries()),
            id: (tasks.length + 1).toString(),
            isCompleted: false,
          } as Task,
        ]
      : tasks;

  // if (!tasks || (optimisticTasks && optimisticTasks.length === 0)) {
  //   return <h2>No Tasks</h2>;
  // }

  return (
    <ul>
      {optimisticTasks.map((task) => (
        <TaskItem key={task.id} {...task} />
      ))}
    </ul>
  );
}

export default TaskList;
