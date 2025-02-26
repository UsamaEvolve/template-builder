import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateElement,
  removeElement,
  updateElementStyles,
  updateDocumentContent,
} from "../redux/templateSlice";

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );
  const documentContent =
    useSelector((state) => state.template.documentContent) || {};

  // Check if selected element is a document field
  const isDocumentField =
    selectedElementId && selectedElementId.startsWith("document-");

  // Extract the field name from the ID if it's a document field
  const documentField = isDocumentField
    ? selectedElementId.replace("document-", "")
    : null;

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
  const selectedElement =
    selectedElementId &&
    !isDocumentField &&
    selectedElementId !== "logo-element"
      ? findElementById(elements, selectedElementId)
      : null;

  // Check if the selected element is the logo
  const isLogo = selectedElementId === "logo-element";

  // Handler for document field styles
  const handleDocumentFieldStyleChange = (property, value) => {
    if (documentField) {
      const currentStyles = documentContent.styles?.[documentField] || {};
      dispatch(
        updateDocumentContent({
          field: "styles",
          value: {
            ...documentContent.styles,
            [documentField]: {
              ...currentStyles,
              [property]: value,
            },
          },
        })
      );
    }
  };

  // Handler for document field margin and padding
  const handleDocumentFieldSpacingChange = (type, side, value) => {
    if (documentField) {
      const currentStyles = documentContent.styles?.[documentField] || {};
      const currentSpacing = currentStyles[type] || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };

      dispatch(
        updateDocumentContent({
          field: "styles",
          value: {
            ...documentContent.styles,
            [documentField]: {
              ...currentStyles,
              [type]: {
                ...currentSpacing,
                [side]: Number(value),
              },
            },
          },
        })
      );
    }
  };

  const handleDocumentFieldContentChange = (value) => {
    if (documentField) {
      dispatch(
        updateDocumentContent({
          field: documentField,
          value: value,
        })
      );
    }
  };

  const handlePropertyChange = (property, value) => {
    if (isLogo) {
      dispatch(
        updateDocumentContent({
          field: property,
          value: value,
        })
      );
    } else if (isDocumentField) {
      handleDocumentFieldContentChange(value);
    } else {
      dispatch(
        updateElement({
          id: selectedElementId,
          properties: { [property]: value },
        })
      );
    }
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
    if (isDocumentField) {
      handleDocumentFieldStyleChange(property, value);
    } else {
      dispatch(
        updateElementStyles({
          id: selectedElementId,
          styles: { [property]: value },
        })
      );
    }
  };

  const handleMarginChange = (side, value) => {
    if (isLogo) {
      const newMargin = {
        ...(documentContent.logoMargin || {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }),
        [side]: Number(value),
      };
      dispatch(
        updateDocumentContent({ field: "logoMargin", value: newMargin })
      );
    } else if (isDocumentField) {
      handleDocumentFieldSpacingChange("margin", side, value);
    } else if (selectedElement) {
      const numericValue = Number(value);
      const newMargin = {
        ...selectedElement.styles.margin,
        [side]: numericValue,
      };
      handleStyleChange("margin", newMargin);
    }
  };

  const handlePaddingChange = (side, value) => {
    if (isLogo) {
      const newPadding = {
        ...(documentContent.logoPadding || {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }),
        [side]: Number(value),
      };
      dispatch(
        updateDocumentContent({ field: "logoPadding", value: newPadding })
      );
    } else if (isDocumentField) {
      handleDocumentFieldSpacingChange("padding", side, value);
    } else if (selectedElement) {
      const numericValue = Number(value);
      const newPadding = {
        ...selectedElement.styles.padding,
        [side]: numericValue,
      };
      handleStyleChange("padding", newPadding);
    }
  };

  const handleFlexChange = (property, value) => {
    if (isDocumentField) {
      const currentStyles = documentContent.styles?.[documentField] || {};
      const currentFlex = currentStyles.flex || {
        grow: 0,
        shrink: 1,
        basis: "auto",
      };

      handleDocumentFieldStyleChange("flex", {
        ...currentFlex,
        [property]: value,
      });
    } else if (selectedElement) {
      const newFlex = { ...selectedElement.styles.flex, [property]: value };
      handleStyleChange("flex", newFlex);
    }
  };

  const handleLogoAlignmentChange = (e) => {
    dispatch(
      updateDocumentContent({ field: "logoAlignment", value: e.target.value })
    );
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(
          updateDocumentContent({ field: "logo", value: e.target.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(
          updateElement({
            id: selectedElementId,
            properties: { image: e.target.result },
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDimensionChange = (property, value) => {
    dispatch(
      updateElement({
        id: selectedElementId,
        properties: { [property]: Number(value) },
      })
    );
  };

  if (!selectedElement && !isLogo && !isDocumentField) {
    return (
      <div className="properties-panel">
        <h4 className="mb-3">Properties</h4>
        <p className="text-muted">Select an element to edit its properties</p>
      </div>
    );
  }

  // Special rendering for document field properties
  if (isDocumentField) {
    const fieldStyles = documentContent.styles?.[documentField] || {
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      display: "block",
      flex: { grow: 0, shrink: 1, basis: "auto" },
    };

    const fieldContent = documentField.includes("[")
      ? getNestedValue(documentContent, documentField)
      : documentContent[documentField];

    return (
      <div className="properties-panel">
        <h4 className="mb-3">Document Field Properties</h4>

        <div className="mb-3">
          <label className="form-label">Field Name</label>
          <input
            type="text"
            className="form-control"
            value={documentField}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            value={fieldContent || ""}
            onChange={(e) => handleDocumentFieldContentChange(e.target.value)}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Display</label>
          <select
            className="form-select"
            value={fieldStyles.display || "block"}
            onChange={(e) =>
              handleDocumentFieldStyleChange("display", e.target.value)
            }
          >
            <option value="block">Block</option>
            <option value="flex">Flex</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline Block</option>
          </select>
        </div>

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
                  value={fieldStyles.margin?.[side] || 0}
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
                <label className="text-muted">{side}</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={side}
                  value={fieldStyles.padding?.[side] || 0}
                  onChange={(e) => handlePaddingChange(side, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Font Style</label>
          <div className="row g-2">
            <div className="col-6">
              <select
                className="form-select"
                value={fieldStyles.fontWeight || "normal"}
                onChange={(e) =>
                  handleDocumentFieldStyleChange("fontWeight", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="bolder">Bolder</option>
                <option value="lighter">Lighter</option>
              </select>
            </div>
            <div className="col-6">
              <select
                className="form-select"
                value={fieldStyles.fontStyle || "normal"}
                onChange={(e) =>
                  handleDocumentFieldStyleChange("fontStyle", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Text Alignment</label>
          <select
            className="form-select"
            value={fieldStyles.textAlign || "left"}
            onChange={(e) =>
              handleDocumentFieldStyleChange("textAlign", e.target.value)
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>

        {fieldStyles.display === "flex" && (
          <>
            <div className="mb-3">
              <label className="form-label">Flexbox</label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Grow"
                    value={fieldStyles.flex?.grow || 0}
                    onChange={(e) => handleFlexChange("grow", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Shrink"
                    value={fieldStyles.flex?.shrink || 1}
                    onChange={(e) => handleFlexChange("shrink", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Basis"
                    value={fieldStyles.flex?.basis || "auto"}
                    onChange={(e) => handleFlexChange("basis", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Justify Content</label>
              <select
                className="form-select"
                value={fieldStyles.justifyContent || "flex-start"}
                onChange={(e) =>
                  handleDocumentFieldStyleChange(
                    "justifyContent",
                    e.target.value
                  )
                }
              >
                <option value="flex-start">Flex Start</option>
                <option value="flex-end">Flex End</option>
                <option value="center">Center</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Align Items</label>
              <select
                className="form-select"
                value={fieldStyles.alignItems || "stretch"}
                onChange={(e) =>
                  handleDocumentFieldStyleChange("alignItems", e.target.value)
                }
              >
                <option value="stretch">Stretch</option>
                <option value="flex-start">Flex Start</option>
                <option value="flex-end">Flex End</option>
                <option value="center">Center</option>
                <option value="baseline">Baseline</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  }

  // Special rendering for logo properties
  if (isLogo) {
    const logoMargin = documentContent.logoMargin || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    const logoPadding = documentContent.logoPadding || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    return (
      <div className="properties-panel">
        <h4 className="mb-3">Logo Properties</h4>

        <div className="mb-3">
          <label className="form-label">Logo Alignment</label>
          <select
            className="form-select"
            value={documentContent.logoAlignment || "left"}
            onChange={handleLogoAlignmentChange}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Change Logo</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Logo Width</label>
          <input
            type="number"
            className="form-control"
            value={documentContent.logoWidth || ""}
            onChange={(e) => handlePropertyChange("logoWidth", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Logo Height</label>
          <input
            type="number"
            className="form-control"
            value={documentContent.logoHeight || ""}
            onChange={(e) => handlePropertyChange("logoHeight", e.target.value)}
          />
        </div>
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
                  value={logoMargin[side]}
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
                <label className="text-muted">{side}</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder={side}
                  value={logoPadding[side]}
                  onChange={(e) => handlePaddingChange(side, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render properties for normal form elements
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
                value={selectedElement.styles?.margin?.[side] || 0}
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
                value={selectedElement.styles?.padding?.[side] || 0}
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
              value={selectedElement.styles?.flex?.grow || 0}
              onChange={(e) => handleFlexChange("grow", e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              placeholder="Shrink"
              value={selectedElement.styles?.flex?.shrink || 1}
              onChange={(e) => handleFlexChange("shrink", e.target.value)}
            />
          </div>
          <div className="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="Basis"
              value={selectedElement.styles?.flex?.basis || "auto"}
              onChange={(e) => handleFlexChange("basis", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Display</label>
        <select
          className="form-select"
          value={selectedElement.styles?.display || "block"}
          onChange={(e) => handleStyleChange("display", e.target.value)}
        >
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="inline">Inline</option>
          <option value="inline-block">Inline Block</option>
        </select>
      </div>

      {selectedElement.styles?.display === "flex" && (
        <>
          <div className="mb-3">
            <label className="form-label">Justify Content</label>
            <select
              className="form-select"
              value={selectedElement.styles?.justifyContent || "flex-start"}
              onChange={(e) =>
                handleStyleChange("justifyContent", e.target.value)
              }
            >
              <option value="flex-start">Flex Start</option>
              <option value="flex-end">Flex End</option>
              <option value="center">Center</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Align Items</label>
            <select
              className="form-select"
              value={selectedElement.styles?.alignItems || "stretch"}
              onChange={(e) => handleStyleChange("alignItems", e.target.value)}
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Flex Start</option>
              <option value="flex-end">Flex End</option>
              <option value="center">Center</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
        </>
      )}

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

      {selectedElement.type === "image" && (
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
          <div className="row g-2 mt-2">
            <div className="col-6">
              <label className="text-muted">Width</label>
              <input
                type="number"
                className="form-control"
                value={selectedElement.width || ""}
                onChange={(e) => handleDimensionChange("width", e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="text-muted">Height</label>
              <input
                type="number"
                className="form-control"
                value={selectedElement.height || ""}
                onChange={(e) =>
                  handleDimensionChange("height", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-danger" onClick={handleDeleteElement}>
          Delete Element
        </button>
      </div>
    </div>
  );
};

// Helper function to get nested values from object using a path string like "sections[0].title"
function getNestedValue(obj, path) {
  if (!obj || !path) return "";

  // Handle array notation like "addresses[0]"
  if (path.includes("[")) {
    const matches = path.match(/(.+?)\[(\d+)\](?:\.(.+))?/);
    if (matches) {
      const [_, arrayName, index, remainingPath] = matches;
      const array = obj[arrayName];
      if (Array.isArray(array) && array[index] !== undefined) {
        if (remainingPath) {
          return getNestedValue(array[index], remainingPath);
        }
        return array[index];
      }
    }
  }

  return obj[path] || "";
}

export default PropertiesPanel;
