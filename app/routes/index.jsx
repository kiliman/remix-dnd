import React, { useState, useCallback } from "react";
import { useLoaderData, useFetcher, useTransition } from "remix";
import { range, inRange } from "lodash";
import { db } from "~/utils/db.server";
import Draggable from "~/components/Draggable";
import TaskForm from "~/components/TaskForm";

const HEIGHT = 55;

export const loader = async () => {
  const data = {
    tasks: await db.task.findMany({
      orderBy: {
        position: "asc",
      },
    }),
  };
  return data;
};

const App = () => {
  const data = useLoaderData();
  const taskList = data.tasks;
  const items = range(taskList.length);
  const transition = useTransition();
  const fetcher = useFetcher();
  const [taskName, setTaskName] = useState("");
  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null,
  });

  const handleDrag = useCallback(
    ({ translation, id }) => {
      const delta = Math.round(translation.y / HEIGHT);
      const index = state.order.indexOf(id);
      const dragOrder = state.order.filter((index) => index !== id);

      if (!inRange(index + delta, 0, items.length)) {
        return;
      }

      dragOrder.splice(index + delta, 0, id);

      setState((state) => ({
        ...state,
        draggedIndex: id,
        dragOrder,
      }));
    },
    [state.order, items.length]
  );

  const handleDragEnd = useCallback(() => {
    setState((state) => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null,
    }));

    const reorderedTasks = taskList.map((task, i) => ({
      ...task,
      position: state.order[task.id - 1],
      name: taskList[i].name,
      isCompleted: taskList[i].isCompleted,
    }));

    fetcher.submit(
      {
        taskList: JSON.stringify(reorderedTasks),
        subaction: "dnd",
      },
      { method: "post", action: "/actions", replace: true }
    );
  }, [fetcher, taskList, state.order]);

  const handleToggle = (event) => {
    const { checked } = event.target;
    const { value } = event.target;
    fetcher.submit(
      {
        checked: checked.toString(),
        taskToToggleId: value,
        actionName: "toggle",
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  const handleUpdate = (event) => {
    fetcher.submit(
      {
        taskToUpdateName: event.target.value,
        taskToUpdateId: event.target.id,
        actionName: "update",
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  return (
    <div className="container">
      {transition.state === "submitting" && <span>Saving...</span>}
      <TaskForm />
      <div style={{ position: "relative", height: HEIGHT * taskList.length }}>
        {taskList.map((task, index) => {
          const isDragging = state.draggedIndex === index;
          const top = state.dragOrder.indexOf(index) * HEIGHT;
          const draggedTop = state.order.indexOf(index) * HEIGHT;

          return (
            <Draggable
              key={index}
              id={index}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <div
                className="task-item"
                style={
                  isDragging
                    ? {
                        transition: "none",
                        height: HEIGHT + "px",
                        top: draggedTop + "px",
                        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.15)",
                      }
                    : {
                        transition: "all 500ms",
                        height: HEIGHT + "px",
                        top: top + "px",
                      }
                }
              >
                <fetcher.Form method="post">
                  <input
                    type="checkbox"
                    value={task.id}
                    defaultChecked={task.isCompleted}
                    onChange={handleToggle}
                  />
                </fetcher.Form>
                <span style={{ width: "100%" }}>{task.name}</span>
                <fetcher.Form method="post" action="/actions">
                  <input type="hidden" name="actionName" value="delete" />
                  <button type="submit" name="taskToDelete" value={task.id}>
                    x
                  </button>
                </fetcher.Form>
              </div>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};

export default App;
