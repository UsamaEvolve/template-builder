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
// 1) Whatever styling I add during editing should also be saved and appear exactly the same in the preview.
// 2) The image I upload should be displayed exactly the same in both the preview and the editor and add height and width of the image in the propertiespanel, user can change the height and width.
// 3) Drag and drop is not working as expected.
// 4) Flexbox is also not working exactly as it should.
