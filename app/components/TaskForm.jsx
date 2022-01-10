import React from "react";
import { Form, useLocation } from "remix";

export default function TaskForm({ position }) {
  const location = useLocation(); // resets form after submit

  return (
    <Form
      className="add-task-form"
      method="post"
      // send this form to the actions route to recieve its actions
      action="/actions"
      key={location.key}
    >
      <div style={{ width: "100%" }}>
        {/* add a hidden input to define a actionName */}
        <input type="hidden" name="actionName" value="create" />
        <input type="hidden" name="position" value={position} />
        <input
          className="add-task-input"
          type="text"
          name="name"
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
