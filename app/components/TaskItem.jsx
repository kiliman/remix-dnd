import { FocusEvent, useState } from "react";
import { useFetcher } from "remix";
import type { Task } from "@prisma/client";

export default function TaskItem({ isCompleted, id, name }: Task) {
  const [taskName, setTaskName] = useState("");
  const fetcher = useFetcher();

  // const { id, name, isCompleted } = task;

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target as HTMLInputElement;
    const { value } = event.target as HTMLInputElement;
    fetcher.submit(
      {
        checked: checked.toString(),
        taskToToggleId: value,
        actionName: "toggle",
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  const handleUpdate = (event: FocusEvent<HTMLFormElement, Element>) => {
    fetcher.submit(
      {
        taskToUpdateName: event.target.value,
        taskToUpdateId: event.target.id,
        actionName: "update",
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  if (!name) {
    return <h2>No Tasks</h2>;
  }
  return (
    <li className="task-item">
      <fetcher.Form method="post">
        <input
          type="checkbox"
          value={id}
          defaultChecked={isCompleted}
          onChange={handleToggle}
        />
      </fetcher.Form>
      <fetcher.Form
        method="post"
        onBlur={(e) => handleUpdate(e)}
        style={{ width: "100%" }}
      >
        <div>
          <input type="hidden" name="actionName" value="update" />
          <input type="hidden" value={taskName} />
          <input
            name="taskToUpdate"
            id={id}
            style={
              isCompleted
                ? {
                    textDecoration: "line-through 2px #ABABAB",
                  }
                : { textDecoration: "none" }
            }
            className="inline-text-input"
            onChange={(e) => setTaskName(e.target.value)}
            defaultValue={name}
            autoComplete="off"
          />
        </div>
      </fetcher.Form>
      <fetcher.Form method="post" action="/actions">
        <input type="hidden" name="actionName" value="delete" />
        <button type="submit" name="taskToDelete" value={id}>
          x
        </button>
      </fetcher.Form>
    </li>
  );
}
