import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  selectElement,
  addElement,
  removeElement,
} from "../redux/templateSlice";
import ColumnElement from "./ColumnElement";

const RowElement = ({ element, index }) => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );
  const isSelected = selectedElementId === element.id;

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(selectElement(element.id));
  };

  const handleAddColumn = (e) => {
    e.stopPropagation();
    dispatch(
      addElement({
        type: "column",
        targetId: element.id,
      })
    );
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeElement(element.id));
  };

  const renderChild = (child, childIndex) => {
    return (
      <div className="col" key={child.id}>
        <ColumnElement element={child} index={childIndex} />
      </div>
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
            <small className="text-muted">Row</small>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={handleAddColumn}
              >
                Add Column
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          </div>

          <Droppable
            droppableId={element.id}
            type="COLUMN"
            direction="horizontal"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="row-container row"
              >
                {element.children && element.children.length > 0 ? (
                  element.children.map((child, childIndex) =>
                    renderChild(child, childIndex)
                  )
                ) : (
                  <div className="text-center w-100 p-3 text-muted">
                    <small>Add columns to this row</small>
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

export default RowElement;
