import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import {
  togglePreviewMode,
  moveElement,
  importTemplate,
  resetTemplate,
} from "../redux/templateSlice";
import ElementsSidebar from "./ElementsSidebar";
import WorkspaceCanvas from "./WorkspaceCanvas";
import PropertiesPanel from "./PropertiesPanel";
import PreviewMode from "./PreviewMode";

const TemplateBuilder = () => {
  const dispatch = useDispatch();
  const isPreviewMode = useSelector((state) => state.template.isPreviewMode);
  const templateState = useSelector((state) => state.template);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    dispatch(
      moveElement({
        sourceId: source.droppableId,
        destinationId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
  };

  const handleExportTemplate = () => {
    const templateData = JSON.stringify(templateState, null, 2);
    const blob = new Blob([templateData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result);
          dispatch(importTemplate(importedState));
        } catch (error) {
          alert("Invalid template file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="template-builder">
      <DragDropContext onDragEnd={handleDragEnd}>
        {!isPreviewMode && <ElementsSidebar />}

        <div className="workspace">
          <div className="toolbar">
            <div>
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => dispatch(togglePreviewMode())}
              >
                {isPreviewMode ? "Edit Mode" : "Preview Mode"}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={handleExportTemplate}
              >
                Export Template
              </button>
              <label className="btn btn-sm btn-outline-secondary me-2">
                Import Template
                <input
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleImportTemplate}
                />
              </label>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to reset the template?"
                    )
                  ) {
                    dispatch(resetTemplate());
                  }
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {isPreviewMode ? (
            <PreviewMode />
          ) : (
            <WorkspaceCanvas elements={templateState.elements} />
          )}
        </div>

        {!isPreviewMode && <PropertiesPanel />}
      </DragDropContext>
    </div>
  );
};

export default TemplateBuilder;
