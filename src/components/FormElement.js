import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import { selectElement } from "../redux/templateSlice";

const FormElement = ({ element, index, parentId }) => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );
  const isSelected = selectedElementId === element.id;
  const elementStyles = {
    margin: element.styles.margin
      ? `${element.styles.margin.top || 8}px ${
          element.styles.margin.right || 8
        }px ${element.styles.margin.bottom || 8}px ${
          element.styles.margin.left || 8
        }px`
      : "0px",
    padding: element.styles.padding
      ? `${element.styles.padding.top || 8}px ${
          element.styles.padding.right || 8
        }px ${element.styles.padding.bottom || 8}px ${
          element.styles.padding.left || 8
        }px`
      : "0px",
    display: element.styles.display || "block",
    justifyContent: element.styles.justifyContent || "flex-start",
    alignItems: element.styles.alignItems || "stretch",
    flexGrow: element.styles.flex?.grow || 0,
    flexShrink: element.styles.flex?.shrink || 1,
    flexBasis: element.styles.flex?.basis || "auto",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(selectElement(element.id));
  };

  const renderInputElement = () => {
    switch (element.type) {
      case "input":
        return (
          <input
            type={element.inputType || "text"}
            className="form-control"
            id={element.name}
            name={element.name}
            placeholder={element.placeholder || ""}
            defaultValue={element.defaultValue || ""}
            required={element.required}
            min={element.min}
            max={element.max}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      case "textarea":
        return (
          <textarea
            className="form-control"
            id={element.name}
            name={element.name}
            placeholder={element.placeholder || ""}
            defaultValue={element.defaultValue || ""}
            required={element.required}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            className="form-check-input"
            id={element.name}
            name={element.name}
            defaultChecked={element.checked}
            required={element.required}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      case "select":
        return (
          <select
            className="form-select"
            id={element.name}
            name={element.name}
            defaultValue={element.defaultValue || ""}
            required={element.required}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="" disabled>
              Select an option
            </option>
            {element.options &&
              element.options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        );

      case "file":
        return (
          <input
            type="file"
            className="form-control"
            id={element.name}
            name={element.name}
            required={element.required}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      default:
        return null;
    }
  };

  return (
    <Draggable
      droppableId="sidebar"
      isDropDisabled={true} // Explicitly set to boolean
      isCombineEnabled={true} // Explicitly set to boolean
      draggableId={element.id}
      index={index || 0}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`form-element ${isSelected ? "selected" : ""}`}
          onClick={handleClick}
          tyle={elementStyles}
          style={elementStyles}
        >
          <div className="mb-3">
            {element.type !== "checkbox" && element.label && (
              <label htmlFor={element.name} className="form-label">
                {element.label}
                {element.required && <span className="text-danger">*</span>}
              </label>
            )}

            {element.type === "checkbox" ? (
              <div className="form-check">
                {renderInputElement()}
                <label className="form-check-label" htmlFor={element.name}>
                  {element.label}
                  {element.required && <span className="text-danger">*</span>}
                </label>
              </div>
            ) : (
              renderInputElement()
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default FormElement;
