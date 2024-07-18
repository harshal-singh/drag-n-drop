"use client";

import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

function App() {
  const [state, setState] = useState([
    {
      id: "droppable-1",
      title: "Day 1",
      tasks: [
        { id: "task-1", text: "Task 1" },
        { id: "task-2", text: "Task 2" },
      ],
    },
    {
      id: "droppable-2",
      title: "Day 2",
      tasks: [{ id: "task-3", text: "Task 3" }],
    },
    {
      id: "droppable-3",
      title: "Day 3",
      tasks: [],
    },
  ]);

  const onDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }

      const sourceIndex = state.findIndex((s) => s.id === source.droppableId);
      const destIndex = state.findIndex(
        (s) => s.id === destination.droppableId
      );

      const newState = [...state];
      const [removed] = newState[sourceIndex].tasks.splice(source.index, 1);
      newState[destIndex].tasks.splice(destination.index, 0, removed);

      setState(newState);
    },
    [state]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center items-start gap-6 p-8 bg-gray-100 min-h-screen">
        {state.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-lg shadow-md p-4 w-80"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  {column.title}
                </h2>
                {column.tasks.length === 0 ? (
                  <div className="text-gray-500 italic text-center py-4">
                    No tasks for this day
                  </div>
                ) : (
                  column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-50 rounded p-4 mb-2 shadow ${
                            snapshot.isDragging
                              ? "bg-blue-100 shadow-lg"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <h4 className="font-medium text-gray-800">
                            {task.text}
                          </h4>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
