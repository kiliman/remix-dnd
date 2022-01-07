import React, { useState, useCallback, useEffect, useRef } from "react";
import { redirect, useLoaderData, useFetcher, useTransition } from "remix";
import { range, inRange } from "lodash";
import { db } from "~/utils/db.server";
import Draggable from "~/components/Draggable";
import { v4 as uuidv4 } from "uuid";

const HEIGHT = 80;

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
  }, []);

  return (
    <div className="container">
      {transition.state === "submitting" && <span>Saving...</span>}
      {taskList.map((task, index) => {
        const isDragging = state.draggedIndex === index;
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);

        return (
          <Draggable
            key={index}
            id={index}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div
              className="task-item"
              isDragging={isDragging}
              top={isDragging ? draggedTop : top}
              style={
                isDragging
                  ? {
                      transition: "none",
                      height: HEIGHT + "px",
                      top: 100 + draggedTop + "px",
                    }
                  : {
                      transition: "all 500ms",
                      height: HEIGHT + "px",
                      top: 100 + top + "px",
                    }
              }
            >
              {state.order[task.id] + " = " + task.name}
              <input type="checkbox" defaultChecked={task.isCompleted} />
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default App;
