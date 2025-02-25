import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Droppable } from "react-beautiful-dnd";
import { clearSelection } from "../redux/templateSlice";
import FormElement from "./FormElement";
import RowElement from "./RowElement";

const WorkspaceCanvas = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.template.elements);

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(clearSelection());
    }
  };

  const renderElement = (element) => {
    if (element.type === "row") {
      return <RowElement key={element.id} element={element} />;
    }
    return <FormElement key={element.id} element={element} />;
  };

  return (
    <Droppable droppableId="workspace" type="ELEMENT">
      {(provided) => (
        <div
          className="canvas"
          onClick={handleCanvasClick}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {elements.map((element, index) => renderElement(element, index))}
          {provided.placeholder}
          {elements.length === 0 && (
            <div className="text-center text-muted p-5">
              <p>
                Drag elements from the sidebar or click on them to add to your
                template
              </p>
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default WorkspaceCanvas;
