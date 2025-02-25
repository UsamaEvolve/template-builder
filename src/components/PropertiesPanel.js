import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateElement,
  removeElement,
  updateElementStyles,
} from "../redux/templateSlice";

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );

  // Helper function to find an element by ID in the nested structure
  const findElementById = (elements, id) => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.children) {
        const found = findElementById(element.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const elements = useSelector((state) => state.template.elements);
  const selectedElement = selectedElementId
    ? findElementById(elements, selectedElementId)
    : null;

  const handlePropertyChange = (property, value) => {
    dispatch(
      updateElement({
        id: selectedElementId,
        properties: { [property]: value },
      })
    );
  };

  const handleOptionChange = (index, property, value) => {
    if (!selectedElement || !selectedElement.options) return;

    const newOptions = [...selectedElement.options];
    newOptions[index] = { ...newOptions[index], [property]: value };

    dispatch(
      updateElement({
        id: selectedElementId,
        properties: { options: newOptions },
      })
    );
  };

  const handleAddOption = () => {
    if (!selectedElement || !selectedElement.options) return;

    const newOptions = [
      ...selectedElement.options,
      {
        value: `option${selectedElement.options.length + 1}`,
        label: `Option ${selectedElement.options.length + 1}`,
      },
    ];

    dispatch(
      updateElement({
        id: selectedElementId,
        properties: { options: newOptions },
      })
    );
  };

  const handleRemoveOption = (index) => {
    if (!selectedElement || !selectedElement.options) return;

    const newOptions = selectedElement.options.filter((_, i) => i !== index);

    dispatch(
      updateElement({
        id: selectedElementId,
        properties: { options: newOptions },
      })
    );
  };

  const handleDeleteElement = () => {
    if (window.confirm("Are you sure you want to delete this element?")) {
      dispatch(removeElement(selectedElementId));
    }
  };

  const handleStyleChange = (property, value) => {
    dispatch(
      updateElementStyles({
        id: selectedElementId,
        styles: { [property]: value },
      })
    );
  };

  const handleMarginChange = (side, value) => {
    const numericValue = Number(value);

    const newMargin = {
      ...selectedElement.styles.margin,
      [side]: numericValue,
    };
    handleStyleChange("margin", newMargin);
  };

  const handlePaddingChange = (side, value) => {
    const numericValue = Number(value);
    const newPadding = {
      ...selectedElement.styles.padding,
      [side]: numericValue,
    };
    handleStyleChange("padding", newPadding);
  };

  const handleFlexChange = (property, value) => {
    const newFlex = { ...selectedElement.styles.flex, [property]: value };
    handleStyleChange("flex", newFlex);
  };
  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h4 className="mb-3">Properties</h4>
        <p className="text-muted">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h4 className="mb-3">Properties</h4>

      <div className="mb-3">
        <label className="form-label">Margin</label>
        <div className="row g-2">
          {["top", "right", "bottom", "left"].map((side) => (
            <div key={side} className="col-6">
              <label className="text-muted">{side}</label>
              <input
                type="number"
                className="form-control"
                placeholder={side}
                value={selectedElement.styles.margin[side]}
                onChange={(e) => handleMarginChange(side, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Padding</label>
        <div className="row g-2">
          {["top", "right", "bottom", "left"].map((side) => (
            <div key={side} className="col-6">
              <label className="text-muted ">{side}</label>

              <input
                type="number"
                className="form-control"
                placeholder={side}
                value={selectedElement.styles.padding[side]}
                onChange={(e) => handlePaddingChange(side, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Flexbox</label>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder="Grow"
              value={selectedElement.styles.flex.grow}
              onChange={(e) => handleFlexChange("grow", e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder="Shrink"
              value={selectedElement.styles.flex.shrink}
              onChange={(e) => handleFlexChange("shrink", e.target.value)}
            />
          </div>
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Basis"
              value={selectedElement.styles.flex.basis}
              onChange={(e) => handleFlexChange("basis", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Display</label>
        <select
          className="form-select"
          value={selectedElement.styles.display}
          onChange={(e) => handleStyleChange("display", e.target.value)}
        >
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="inline">Inline</option>
          <option value="inline-block">Inline Block</option>
        </select>
      </div>
      {/* Justify Content Controls */}
      <div className="mb-3">
        <label className="form-label">Justify Content</label>
        <select
          className="form-select"
          value={selectedElement.styles.justifyContent}
          onChange={(e) => handleStyleChange("justifyContent", e.target.value)}
        >
          <option value="flex-start">Flex Start</option>
          <option value="flex-end">Flex End</option>
          <option value="center">Center</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
        </select>
      </div>

      {/* Align Items Controls */}
      <div className="mb-3">
        <label className="form-label">Align Items</label>
        <select
          className="form-select"
          value={selectedElement.styles.alignItems}
          onChange={(e) => handleStyleChange("alignItems", e.target.value)}
        >
          <option value="stretch">Stretch</option>
          <option value="flex-start">Flex Start</option>
          <option value="flex-end">Flex End</option>
          <option value="center">Center</option>
          <option value="baseline">Baseline</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Element Type</label>
        <input
          type="text"
          className="form-control"
          value={
            selectedElement.type === "input"
              ? `${selectedElement.inputType} input`
              : selectedElement.type
          }
          disabled
        />
      </div>

      {selectedElement.type !== "row" && selectedElement.type !== "column" && (
        <div className="mb-3">
          <label className="form-label">Label</label>
          <input
            type="text"
            className="form-control"
            value={selectedElement.label || ""}
            onChange={(e) => handlePropertyChange("label", e.target.value)}
          />
        </div>
      )}

      {selectedElement.type !== "row" && selectedElement.type !== "column" && (
        <div className="mb-3">
          <label className="form-label">Name (ID)</label>
          <input
            type="text"
            className="form-control"
            value={selectedElement.name || ""}
            onChange={(e) => handlePropertyChange("name", e.target.value)}
          />
        </div>
      )}

      {(selectedElement.type === "input" ||
        selectedElement.type === "textarea") && (
        <div className="mb-3">
          <label className="form-label">Placeholder</label>
          <input
            type="text"
            className="form-control"
            value={selectedElement.placeholder || ""}
            onChange={(e) =>
              handlePropertyChange("placeholder", e.target.value)
            }
          />
        </div>
      )}

      {(selectedElement.type === "input" ||
        selectedElement.type === "textarea" ||
        selectedElement.type === "select") && (
        <div className="mb-3">
          <label className="form-label">Default Value</label>
          <input
            type="text"
            className="form-control"
            value={selectedElement.defaultValue || ""}
            onChange={(e) =>
              handlePropertyChange("defaultValue", e.target.value)
            }
          />
        </div>
      )}

      {selectedElement.type === "select" && (
        <div className="mb-3">
          <label className="form-label">Options</label>
          {selectedElement.options &&
            selectedElement.options.map((option, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) =>
                    handleOptionChange(index, "label", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) =>
                    handleOptionChange(index, "value", e.target.value)
                  }
                />
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                >
                  ×
                </button>
              </div>
            ))}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleAddOption}
          >
            Add Option
          </button>
        </div>
      )}

      {selectedElement.type !== "row" && selectedElement.type !== "column" && (
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="requiredCheck"
            checked={selectedElement.required || false}
            onChange={(e) => handlePropertyChange("required", e.target.checked)}
          />
          <label className="form-check-label" htmlFor="requiredCheck">
            Required
          </label>
        </div>
      )}

      {selectedElement.type === "input" &&
        selectedElement.inputType === "number" && (
          <>
            <div className="mb-3">
              <label className="form-label">Min Value</label>
              <input
                type="number"
                className="form-control"
                value={selectedElement.min || ""}
                onChange={(e) => handlePropertyChange("min", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Max Value</label>
              <input
                type="number"
                className="form-control"
                value={selectedElement.max || ""}
                onChange={(e) => handlePropertyChange("max", e.target.value)}
              />
            </div>
          </>
        )}

      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-danger" onClick={handleDeleteElement}>
          Delete Element
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
