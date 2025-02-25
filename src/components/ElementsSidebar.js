import React from "react";
import { useDispatch } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { addElement } from "../redux/templateSlice";
import {
  FaTextWidth,
  FaHashtag,
  FaEnvelope,
  FaRegSquare,
  FaCaretDown,
  FaFileUpload,
  FaColumns,
  FaGripLines,
} from "react-icons/fa";

const ElementsSidebar = () => {
  const dispatch = useDispatch();

  const elementTypes = [
    {
      id: "text-input",
      label: "Text Input",
      type: "input",
      inputType: "text",
      icon: <FaTextWidth />,
    },
    {
      id: "number-input",
      label: "Number Input",
      type: "input",
      inputType: "number",
      icon: <FaHashtag />,
    },
    {
      id: "email-input",
      label: "Email Input",
      type: "input",
      inputType: "email",
      icon: <FaEnvelope />,
    },
    {
      id: "textarea",
      label: "Text Area",
      type: "textarea",
      icon: <FaRegSquare />,
    },
    {
      id: "checkbox",
      label: "Checkbox",
      type: "checkbox",
      icon: <FaRegSquare />,
    },
    { id: "select", label: "Dropdown", type: "select", icon: <FaCaretDown /> },
    {
      id: "file-upload",
      label: "File Upload",
      type: "file",
      icon: <FaFileUpload />,
    },
    {
      id: "row",
      label: "Row",
      type: "row",
      children: [],
      icon: <FaGripLines />,
    },
    {
      id: "column",
      label: "Column",
      type: "column",
      children: [],
      icon: <FaColumns />,
    },
  ];

  const handleAddElement = (elementType) => {
    const baseProperties = {
      label: `New ${elementType.label}`,
      name: `${elementType.id}_${Date.now()}`,
      required: false,
      placeholder: "",
      defaultValue: "",
    };

    let element = {
      type: elementType.type,
      ...baseProperties,
    };

    if (elementType.type === "input") {
      element.inputType = elementType.inputType;
    } else if (elementType.type === "select") {
      element.options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
      ];
    } else if (elementType.type === "checkbox") {
      element.checked = false;
    } else if (elementType.type === "row" || elementType.type === "column") {
      element.children = [];
    }

    dispatch(addElement(element));
  };

  return (
    <div className="sidebar p-3">
      <h4 className="mb-3">Elements</h4>
      <Droppable droppableId="sidebar" type="ELEMENT">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elementTypes.map((elementType, index) => (
              <Draggable
                key={elementType.id}
                draggableId={`sidebar-${elementType.id}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="element-button sidebar-text-icon"
                    onClick={() => handleAddElement(elementType)}
                    style={{ fontSize: "13px" }}
                  >
                    {elementType.icon}{" "}
                    <span className="label-sidebar">{elementType.label}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ElementsSidebar;
