import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Droppable } from "react-beautiful-dnd";
import { clearSelection } from "../redux/templateSlice";
import DocumentEditor from "./DocumentEditor";
import Doc from "./Doc";

const WorkspaceCanvas = () => {
  const dispatch = useDispatch();

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(clearSelection());
    }
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
          <Doc />
          {/* <DocumentEditor /> */}
          {/* {provided.placeholder} */}
          {/* {elements.length === 0 && (
            <div className="text-center text-muted p-5">
              <p>
                Drag elements from the sidebar or click on them to add to your
                template
              </p>
            </div>
          )} */}
        </div>
      )}
    </Droppable>
  );
};

export default WorkspaceCanvas;
