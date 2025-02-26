import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PreviewMode = () => {
  const elements = useSelector((state) => state.template.elements);
  const documentContent = useSelector(
    (state) => state.template.documentContent || {}
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  // Helper function to find all field elements in the nested structure
  const findAllFields = (elements) => {
    let fields = [];

    const traverse = (items) => {
      items.forEach((item) => {
        if (item.type !== "row" && item.type !== "column") {
          fields.push(item);
        }

        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };

    traverse(elements);
    return fields;
  };

  const allFields = findAllFields(elements);

  // Generate validation schema from fields
  const generateValidationSchema = () => {
    const schema = {};

    allFields.forEach((field) => {
      if (field.name) {
        let fieldSchema;

        switch (field.type) {
          case "input":
            switch (field.inputType) {
              case "email":
                fieldSchema = Yup.string().email("Invalid email address");
                break;
              case "number":
                fieldSchema = Yup.number().typeError("Must be a number");
                if (field.min !== undefined && field.min !== "") {
                  fieldSchema = fieldSchema.min(
                    Number(field.min),
                    `Minimum value is ${field.min}`
                  );
                }
                if (field.max !== undefined && field.max !== "") {
                  fieldSchema = fieldSchema.max(
                    Number(field.max),
                    `Maximum value is ${field.max}`
                  );
                }
                break;
              default:
                fieldSchema = Yup.string();
            }
            break;
          case "textarea":
            fieldSchema = Yup.string();
            break;
          case "checkbox":
            fieldSchema = Yup.boolean();
            break;
          case "select":
            fieldSchema = Yup.string();
            break;
          case "file":
            fieldSchema = Yup.mixed();
            break;
          default:
            fieldSchema = Yup.string();
        }

        if (field.required) {
          fieldSchema = fieldSchema.required("This field is required");
        }

        schema[field.name] = fieldSchema;
      }
    });

    return Yup.object().shape(schema);
  };

  // Generate initial values from fields
  const generateInitialValues = () => {
    const initialValues = {};

    allFields.forEach((field) => {
      if (field.name) {
        if (field.type === "checkbox") {
          initialValues[field.name] = field.checked || false;
        } else {
          initialValues[field.name] = field.defaultValue || "";
        }
      }
    });

    return initialValues;
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);
    setFormData(values);
    setFormSubmitted(true);
    setSubmitting(false);
  };

  const renderEditableField = (field, value, isMultiline = false) => {
    const fieldStyles = documentContent?.styles?.[field] || {};

    // Properly handle margin and padding objects
    const getStyleValue = (styleObj) => {
      if (!styleObj) return undefined;

      if (typeof styleObj === "object") {
        const { top = 0, right = 0, bottom = 0, left = 0 } = styleObj;
        return `${top}px ${right}px ${bottom}px ${left}px`;
      }

      return styleObj;
    };

    const styles = {
      margin: getStyleValue(fieldStyles.margin),
      padding: getStyleValue(fieldStyles.padding),
      display: fieldStyles.display || "block",
      flexGrow: fieldStyles.flex?.grow,
      flexShrink: fieldStyles.flex?.shrink,
      flexBasis: fieldStyles.flex?.basis,
      justifyContent: fieldStyles.justifyContent,
      alignItems: fieldStyles.alignItems,
    };

    return (
      <div className="editable-field" style={styles}>
        {isMultiline ? (
          <textarea
            value={value || ""}
            readOnly
            className="form-control"
            style={{ width: "100%", minHeight: "80px" }}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            readOnly
            className="form-control"
          />
        )}
      </div>
    );
  };

  // Function to get logo alignment style
  const getLogoAlignmentStyle = () => {
    const alignment = documentContent.logoAlignment || "left";
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

    const margin = `${logoMargin.top}px ${logoMargin.right}px ${logoMargin.bottom}px ${logoMargin.left}px`;
    const padding = `${logoPadding.top}px ${logoPadding.right}px ${logoPadding.bottom}px ${logoPadding.left}px`;

    const baseStyle = {
      margin,
      padding,
      display: "block",
    };

    switch (alignment) {
      case "center":
        return {
          ...baseStyle,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        };
      case "right":
        return {
          ...baseStyle,
          marginLeft: "auto",
          textAlign: "right",
        };
      default: // "left"
        return {
          ...baseStyle,
          marginRight: "auto",
          textAlign: "left",
        };
    }
  };

  // Render document header content
  const renderDocumentHeader = () => {
    return (
      <div className="document-preview mb-5 pb-4 border-bottom">
        <div className="document-header mb-4">
          <div className="logo-section mb-3" style={getLogoAlignmentStyle()}>
            {documentContent.logo && (
              <img
                src={documentContent.logo}
                alt="Company Logo"
                className="company-logo"
                style={{
                  width: documentContent.logoWidth
                    ? `${documentContent.logoWidth}px`
                    : "auto",
                  height: documentContent.logoHeight
                    ? `${documentContent.logoHeight}px`
                    : "auto",
                }}
              />
            )}
          </div>

          <div className="document-date mb-3">
            {renderEditableField("date", documentContent.date)}
          </div>
        </div>

        <div className="document-body">
          <div className="company-addresses mb-4">
            <h4 className="mb-2">{documentContent.companyName}</h4>
            {documentContent.addresses &&
              documentContent.addresses.map((address, index) => (
                <div key={index} className="address-line">
                  {renderEditableField(`addresses[${index}]`, address)}
                </div>
              ))}
          </div>

          <div className="accordia-address mb-4">
            {renderEditableField(
              "accordiaAddress",
              documentContent.accordiaAddress,
              true
            )}
          </div>

          <h2 className="document-title mb-4">
            {renderEditableField("title", documentContent.title)}
          </h2>

          <div className="recipient-section mb-4">
            {renderEditableField("recipient", documentContent.recipient)}
          </div>

          <div className="document-content mb-4">
            {renderEditableField("body", documentContent.body, true)}
          </div>

          <div className="document-sections mb-4">
            {documentContent.sections &&
              documentContent.sections.map((section, index) => (
                <div key={index} className="section mb-3">
                  <h4 className="section-title">
                    {renderEditableField(
                      `sections[${index}].title`,
                      section.title
                    )}
                  </h4>
                  <div className="section-content">
                    {renderEditableField(
                      `sections[${index}].content`,
                      section.content,
                      true
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="document-footer mt-4">
            {renderEditableField("footer", documentContent.footer, true)}
          </div>
        </div>
      </div>
    );
  };

  // Render a form element based on its type
  const renderFormElement = (element) => {
    // Apply element styles from styles object
    const getElementStyles = (element) => {
      if (!element.styles) return {};

      const { margin, padding, display, flex, justifyContent, alignItems } =
        element.styles;

      const styles = {};

      // Handle margin and padding objects
      if (margin) {
        const { top = 0, right = 0, bottom = 0, left = 0 } = margin;
        styles.margin = `${top}px ${right}px ${bottom}px ${left}px`;
      }

      if (padding) {
        const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
        styles.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }

      if (display) styles.display = display;

      if (flex) {
        styles.flexGrow = flex.grow;
        styles.flexShrink = flex.shrink;
        styles.flexBasis = flex.basis;
      }

      if (justifyContent) styles.justifyContent = justifyContent;
      if (alignItems) styles.alignItems = alignItems;

      return styles;
    };

    switch (element.type) {
      case "row":
        return (
          <div
            key={element.id}
            className="row"
            style={getElementStyles(element)}
          >
            {element.children &&
              element.children.map((column) => renderFormElement(column))}
          </div>
        );

      case "column":
        return (
          <div
            key={element.id}
            className="col"
            style={getElementStyles(element)}
          >
            {element.children &&
              element.children.map((child) => renderFormElement(child))}
          </div>
        );

      case "input":
        return (
          <div
            key={element.id}
            className="mb-3"
            style={getElementStyles(element)}
          >
            <label htmlFor={element.name} className="form-label">
              {element.label}
              {element.required && <span className="text-danger">*</span>}
            </label>
            <Field
              type={element.inputType || "text"}
              className="form-control"
              id={element.name}
              name={element.name}
              placeholder={element.placeholder || ""}
              min={element.min}
              max={element.max}
            />
            <ErrorMessage
              name={element.name}
              component="div"
              className="text-danger"
            />
          </div>
        );

      case "textarea":
        return (
          <div
            key={element.id}
            className="mb-3"
            style={getElementStyles(element)}
          >
            <label htmlFor={element.name} className="form-label">
              {element.label}
              {element.required && <span className="text-danger">*</span>}
            </label>
            <Field
              as="textarea"
              className="form-control"
              id={element.name}
              name={element.name}
              placeholder={element.placeholder || ""}
              rows="3"
            />
            <ErrorMessage
              name={element.name}
              component="div"
              className="text-danger"
            />
          </div>
        );

      case "checkbox":
        return (
          <div
            key={element.id}
            className="mb-3 form-check"
            style={getElementStyles(element)}
          >
            <Field
              type="checkbox"
              className="form-check-input"
              id={element.name}
              name={element.name}
            />
            <label htmlFor={element.name} className="form-check-label">
              {element.label}
              {element.required && <span className="text-danger">*</span>}
            </label>
            <ErrorMessage
              name={element.name}
              component="div"
              className="text-danger"
            />
          </div>
        );

      case "select":
        return (
          <div
            key={element.id}
            className="mb-3"
            style={getElementStyles(element)}
          >
            <label htmlFor={element.name} className="form-label">
              {element.label}
              {element.required && <span className="text-danger">*</span>}
            </label>
            <Field
              as="select"
              className="form-select"
              id={element.name}
              name={element.name}
            >
              <option value="">Select an option</option>
              {element.options &&
                element.options.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </Field>
            <ErrorMessage
              name={element.name}
              component="div"
              className="text-danger"
            />
          </div>
        );

      case "file":
        return (
          <div
            key={element.id}
            className="mb-3"
            style={getElementStyles(element)}
          >
            <label htmlFor={element.name} className="form-label">
              {element.label}
              {element.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="file"
              className="form-control"
              id={element.name}
              name={element.name}
              onChange={(event) => {
                // This is needed for file inputs as Formik doesn't handle them directly
                const file = event.currentTarget.files[0];
                console.log("File selected:", file);
              }}
            />
            <ErrorMessage
              name={element.name}
              component="div"
              className="text-danger"
            />
          </div>
        );

      case "image":
        return (
          <div
            key={element.id}
            className="mb-3"
            style={getElementStyles(element)}
          >
            {element.image && (
              <img
                src={element.image}
                alt={element.label || "Image"}
                style={{
                  width: element.width ? `${element.width}px` : "auto",
                  height: element.height ? `${element.height}px` : "auto",
                }}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (formSubmitted) {
    return (
      <div className="preview-mode">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title text-success">
              Form Submitted Successfully
            </h4>
            <p className="card-text">
              Your form has been submitted with the following values:
            </p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setFormSubmitted(false)}
            >
              Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-mode">
      <h4 className="mb-4">Form Preview</h4>

      {/* Render document content before the form */}
      {renderDocumentHeader()}

      {elements.length === 0 ? (
        <div className="alert alert-info">
          No form elements added yet. Switch to Edit Mode to add elements.
        </div>
      ) : (
        <Formik
          initialValues={generateInitialValues()}
          validationSchema={generateValidationSchema()}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {elements.map((element) => renderFormElement(element))}

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Template"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default PreviewMode;
