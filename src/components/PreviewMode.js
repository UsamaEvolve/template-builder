// File: src/components/PreviewMode.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PreviewMode = () => {
  const elements = useSelector((state) => state.template.elements);
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

  // Render a form element based on its type
  const renderFormElement = (element) => {
    console.log(element, "element");
    switch (element.type) {
      case "row":
        return (
          <div
            //    style={{element.styles}}
            key={element.id}
            className="row"
          >
            {element.children &&
              element.children.map((column) => renderFormElement(column))}
          </div>
        );

      case "column":
        return (
          <div key={element.id} className="col">
            {element.children &&
              element.children.map((child) => renderFormElement(child))}
          </div>
        );

      case "input":
        return (
          <div key={element.id} className="mb-3">
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
          <div key={element.id} className="mb-3">
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
          <div key={element.id} className="mb-3 form-check">
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
          <div key={element.id} className="mb-3">
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
          <div key={element.id} className="mb-3">
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
                // You would typically handle the file here (e.g., store in state or upload)
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
