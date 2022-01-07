import React, { useRef } from "react";
import { Form } from "remix";

export default function TaskForm() {
  // useRef to clear the input after submit
  const addTaskRef = useRef(null);

  function clearInput() {
    // setTimeout(() => (addTaskRef!.current!.value = ""), 1);
    addTaskRef.current.value = "";
  }

  return (
    <Form
      className="add-task-form"
      method="post"
      // send this form to the actions route to recieve its actions
      action="/actions"
      // clear the input
      onSubmit={() => clearInput}
    >
      <div style={{ width: "100%" }}>
        {/* add a hidden input to define a actionName */}
        <input type="hidden" name="actionName" value="create" />
        <input
          ref={addTaskRef}
          className="add-task-input"
          type="text"
          name="taskName"
          placeholder="Add Task"
          autoComplete="off"
        />
      </div>
      <div>
        <button type="submit" className="add-task-btn">
          +
        </button>
      </div>
    </Form>
  );
}
