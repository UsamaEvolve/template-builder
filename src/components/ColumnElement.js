import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { selectElement, addElement } from "../redux/templateSlice";
import FormElement from "./FormElement";

const ColumnElement = ({ element, index }) => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );
  const isSelected = selectedElementId === element.id;

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(selectElement(element.id));
  };

  const handleAddFormElement = (e) => {
    e.stopPropagation();
    dispatch(
      addElement({
        type: "input",
        targetId: element.id,
      })
    );
  };

  const renderChild = (child, childIndex) => {
    return (
      <FormElement
        key={child.id}
        element={child}
        index={childIndex}
        parentId={element.id}
      />
    );
  };

  return (
    <Draggable draggableId={element.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`form-element ${isSelected ? "selected" : ""}`}
          onClick={handleClick}
        >
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <small className="text-muted">Column</small>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleAddFormElement}
            >
              Add Input
            </button>
          </div>

          <Droppable droppableId={element.id} type="INPUT">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="column-container"
              >
                {element.children && element.children.length > 0 ? (
                  element.children.map((child, childIndex) =>
                    renderChild(child, childIndex)
                  )
                ) : (
                  <div className="text-center w-100 p-3 text-muted">
                    <small>Add form elements to this column</small>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default ColumnElement;
