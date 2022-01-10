import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData, useFetcher, useTransition, useLocation } from "remix";
import { ReactSortable } from "react-sortablejs";
import { db } from "~/utils/db.server";
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
  const { tasks } = useLoaderData();
  const transition = useTransition();
  const fetcher = useFetcher();
  const [state, setState] = useState(tasks);
  useEffect(() => {
    setState(tasks);
  }, [tasks]);

  const handleDragEnd = useCallback(
    (newTasks) => {
      // prevent running during SSR
      if (typeof window === "undefined") return;

      const oldIds = tasks.map((task) => task.id);
      const newIds = newTasks.map((task) => task.id);
      // return if nothing changed
      if (compareArray(oldIds, newIds)) return;

      setState(newTasks);

      fetcher.submit(
        {
          actionName: "dnd",
          taskIds: newIds,
        },
        { method: "post", action: "/actions", replace: true }
      );
    },
    [fetcher, tasks]
  );

  const handleToggle = (event) => {
    const { value, checked } = event.target;
    const task = state.find((task) => task.id === value);
    task.isCompleted = checked;
    setState(state);
    fetcher.submit(
      {
        actionName: "toggle",
        id: value,
        isCompleted: checked,
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  const handleUpdate = (event) => {
    const { id, value } = event.target;
    fetcher.submit(
      {
        actionName: "update",
        id,
        name: value,
      },
      { method: "post", action: "/actions", replace: true }
    );
  };

  return (
    <div className="container">
      {transition.state === "submitting" && <span>Saving...</span>}
      <TaskForm position={tasks.length} />
      <div style={{ position: "relative", height: HEIGHT * tasks.length }}>
        <ReactSortable list={state} setList={handleDragEnd}>
          {state.map((task) => (
            <div key={task.id} className="task-item">
              <fetcher.Form method="post">
                <input
                  type="checkbox"
                  value={task.id}
                  defaultChecked={task.isCompleted}
                  onChange={handleToggle}
                />
              </fetcher.Form>
              <div>
                <fetcher.Form
                  method="post"
                  action="/actions"
                  onBlur={(e) => handleUpdate(e)}
                  style={{ width: "100%" }}
                >
                  <input type="hidden" name="actionName" value="update" />
                  <input type="hidden" name="id" value={task.id} />
                  <div style={{ display: "flex" }}>
                    <div>
                      <input
                        name="name"
                        id={task.id}
                        style={
                          task.isCompleted
                            ? {
                                textDecoration: "line-through 2px #ABABAB",
                              }
                            : { textDecoration: "none" }
                        }
                        className="inline-text-input"
                        defaultValue={
                          // HERE IT IS!
                          task.name
                        }
                        autoComplete="off"
                      />
                      <span> = {task.position}</span>
                    </div>
                  </div>
                </fetcher.Form>
              </div>
              <fetcher.Form method="post" action="/actions">
                <input type="hidden" name="actionName" value="delete" />
                <button
                  type="submit"
                  name="id"
                  data-action="delete"
                  value={task.id}
                >
                  x
                </button>
              </fetcher.Form>
            </div>
          ))}
        </ReactSortable>
      </div>
    </div>
  );
};

function compareArray(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default App;
