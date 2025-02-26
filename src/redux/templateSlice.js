import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elements: [],
  selectedElementId: null,
  isPreviewMode: false,
  nextId: 1,
  documentContent: null,
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    addElement: (state, action) => {
      const newElement = {
        id: `element-${state.nextId}`,
        ...action.payload,
        styles: {
          margin: { top: 8, right: 8, bottom: 8, left: 8 },
          padding: { top: 8, right: 8, bottom: 8, left: 8 },
          flex: { grow: 0, shrink: 1, basis: "auto" },
          display: "block",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
      };
      state.nextId += 1;

      if (action.payload.targetId) {
        // Add to specific row/column
        const targetIndex = state.elements.findIndex(
          (el) => el.id === action.payload.targetId
        );
        if (targetIndex !== -1) {
          if (state.elements[targetIndex].type === "row") {
            if (!state.elements[targetIndex].children) {
              state.elements[targetIndex].children = [];
            }
            state.elements[targetIndex].children.push(newElement);
          } else if (state.elements[targetIndex].type === "column") {
            if (!state.elements[targetIndex].children) {
              state.elements[targetIndex].children = [];
            }
            state.elements[targetIndex].children.push(newElement);
          }
        }
      } else {
        // Add to root level
        state.elements.push(newElement);
      }
    },

    updateElementStyles: (state, action) => {
      console.log("updateElementStyles called with payload:", action.payload); // Debugging
      const { id, styles } = action.payload;

      const updateNestedElementStyles = (elements) => {
        return elements.map((el) => {
          if (el.id === id) {
            return { ...el, styles: { ...el.styles, ...styles } };
          }
          if (el.children) {
            return {
              ...el,
              children: updateNestedElementStyles(el.children),
            };
          }
          return el;
        });
      };

      state.elements = updateNestedElementStyles(state.elements);
    },
    updateElement: (state, action) => {
      const { id, properties } = action.payload;

      // Helper function to update nested elements
      const updateNestedElement = (elements) => {
        return elements.map((el) => {
          if (el.id === id) {
            return { ...el, ...properties };
          }
          if (el.children) {
            return { ...el, children: updateNestedElement(el.children) };
          }
          return el;
        });
      };

      state.elements = updateNestedElement(state.elements);
    },
    removeElement: (state, action) => {
      const id = action.payload;

      // Helper function to remove nested elements
      const filterNestedElements = (elements) => {
        return elements.filter((el) => {
          if (el.id === id) {
            return false;
          }
          if (el.children) {
            el.children = filterNestedElements(el.children);
          }
          return true;
        });
      };

      state.elements = filterNestedElements(state.elements);

      // If the selected element was removed, clear selection
      if (state.selectedElementId === id) {
        state.selectedElementId = null;
      }
    },
    selectElement: (state, action) => {
      state.selectedElementId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedElementId = null;
    },
    togglePreviewMode: (state) => {
      state.isPreviewMode = !state.isPreviewMode;
      if (state.isPreviewMode) {
        state.selectedElementId = null;
      }
    },
    moveElement: (state, action) => {
      const { sourceId, destinationId, sourceIndex, destinationIndex } =
        action.payload;

      // Function to find element and parent by ID
      const findElementAndParent = (elements, id, parent = null) => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].id === id) {
            return { element: elements[i], parent, index: i };
          }
          if (elements[i].children) {
            const result = findElementAndParent(
              elements[i].children,
              id,
              elements[i]
            );
            if (result.element) {
              return result;
            }
          }
        }
        return { element: null, parent: null, index: -1 };
      };

      // Find source container and element
      let sourceContainer = state.elements;
      if (sourceId !== "root") {
        const { element } = findElementAndParent(state.elements, sourceId);
        if (element && element.children) {
          sourceContainer = element.children;
        }
      }

      // Find destination container
      let destContainer = state.elements;
      if (destinationId !== "root") {
        const { element } = findElementAndParent(state.elements, destinationId);
        if (element && element.children) {
          destContainer = element.children;
        }
      }

      // Perform the move
      const [removed] = sourceContainer.splice(sourceIndex, 1);
      destContainer.splice(destinationIndex, 0, removed);
    },
    importTemplate: (state, action) => {
      const importedState = action.payload;
      return { ...importedState, isPreviewMode: state.isPreviewMode };
    },
    resetTemplate: (state) => {
      return { ...initialState, nextId: state.nextId };
    },
    updateDocumentContent: (state, action) => {
      const { field, value } = action.payload;
      if (field.startsWith("styles.")) {
        const styleField = field.split(".")[1];
        return {
          ...state,
          documentContent: {
            ...state.documentContent,
            styles: {
              ...state.documentContent.styles,
              [styleField]: value,
            },
          },
        };
      }
      return {
        ...state,
        documentContent: {
          ...state.documentContent,
          [field]: value,
        },
      };
    },
  },
});

export const {
  addElement,
  updateElement,
  updateDocumentContent,
  updateElementStyles,
  removeElement,
  selectElement,
  clearSelection,
  togglePreviewMode,
  moveElement,
  importTemplate,
  resetTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;
