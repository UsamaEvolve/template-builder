import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDocumentContent, selectElement } from "../redux/templateSlice";
import RowElement from "./RowElement";
import FormElement from "./FormElement";

const DocumentEditor = () => {
  const dispatch = useDispatch();
  const documentContent = useSelector(
    (state) => state.template.documentContent || {}
  );
  const elements = useSelector((state) => state.template.elements);
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );
  const [editingField, setEditingField] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoId] = useState("logo-element");

  const initialDocument = {
    styles: {
      date: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      companyName: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      addresses: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      accordiaAddress: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      title: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      recipient: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      body: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      footer: {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        display: "block",
      },
      logoAlignment: "left",
      logoMargin: { top: 0, right: 0, bottom: 0, left: 0 },
      logoPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    logo: null,
    date: "18/02/2025",
    companyName: "matrix pharma 1",
    addresses: ["Vietnam Kon Tum Kon Tum", "Hung Yên, Hung Yên", "Vietnam"],
    accordiaAddress: `ACCORDIA GLOBAL COMPLIANCE GROUP VIETNAM
    Room 3, Floor 6, No 23B, Road No 3, Block 2, An Khanh Ward
    Thù Đức, Ho Chi Minh
    Vietnam`,
    title: "Quotation for SMETA (FULL INITIAL AUDIT) Certification Services",
    recipient: "DR Umair",
    body: `Thank you for application and considering Accordia Global Compliance Group for your SMETA (FULL INITIAL
    AUDIT) audit. You have chosen a premier auditing company with a strong reputation for competence, integrity
    and responsiveness to its clients. We are sure you will agree that our people, audit expertise and our relentless
    commitment to exceptional customer service makes us different.`,
    sections: [
      {
        title: "Part 1",
        content:
          "Provides the cost details for your services as well as the length, on days, of your audit",
      },
      {
        title: "Part 2",
        content: "Provides the scope of the audit and site(s) details",
      },
    ],
    footer: `This proposal is considered confidential property of Accordia Global Compliance Group and is intended for the sole
    use of and is not be shared outside of either organization`,
    logoAlignment: "left",
  };

  useEffect(() => {
    if (!documentContent || Object.keys(documentContent).length === 0) {
      Object.entries(initialDocument).forEach(([field, value]) => {
        dispatch(updateDocumentContent({ field, value }));
      });
    }
    if (documentContent?.logo) {
      setLogo(documentContent.logo);
    }
  }, [documentContent, dispatch]);

  const handleTextChange = (field, value) => {
    dispatch(updateDocumentContent({ field, value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoData = reader.result;
        setLogo(logoData);
        dispatch(updateDocumentContent({ field: "logo", value: logoData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = (e) => {
    e.stopPropagation();
    dispatch(selectElement(logoId));
  };

  const parseSpacingValue = (value) => {
    if (!value) return { top: 0, right: 0, bottom: 0, left: 0 };
    if (typeof value === "string")
      return { top: 0, right: 0, bottom: 0, left: 0 };
    return {
      top: value.top || 0,
      right: value.right || 0,
      bottom: value.bottom || 0,
      left: value.left || 0,
    };
  };

  const spacingToCss = (spacingObj) => {
    const spacing = parseSpacingValue(spacingObj);
    return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
  };

  const getLogoStyles = () => {
    const alignment = documentContent?.logoAlignment || "left";
    const logoMargin = documentContent?.logoMargin || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    const logoPadding = documentContent?.logoPadding || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    const alignmentStyle = {
      margin: spacingToCss(logoMargin),
      padding: spacingToCss(logoPadding),
    };

    switch (alignment) {
      case "center":
        return {
          ...alignmentStyle,
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
          textAlign: "center",
        };
      case "right":
        return {
          ...alignmentStyle,
          marginLeft: "auto",
          marginRight: logoMargin.right + "px",
          display: "block",
          textAlign: "right",
        };
      default:
        return {
          ...alignmentStyle,
          marginLeft: logoMargin.left + "px",
          marginRight: "auto",
          display: "block",
          textAlign: "left",
        };
    }
  };

  const getElementStyles = (field) => {
    if (!documentContent?.styles) return {};
    const fieldStyles = documentContent.styles[field] || {};
    const margin = parseSpacingValue(fieldStyles.margin);
    const padding = parseSpacingValue(fieldStyles.padding);
    return {
      margin: spacingToCss(margin),
      padding: spacingToCss(padding),
      display: fieldStyles.display || "block",
    };
  };

  const renderEditableField = (field, value, isMultiline = false) => {
    const isSelected = selectedElementId === `document-${field}`;
    const displayValue = documentContent[field] || value;

    const handleClick = (e) => {
      e.stopPropagation();
      dispatch(selectElement(`document-${field}`));
      setEditingField(field);
    };

    return (
      <div
        className={`editable-field ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
        style={getElementStyles(field)}
      >
        {editingField === field ? (
          isMultiline ? (
            <textarea
              value={displayValue}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="form-control"
            />
          ) : (
            <input
              type="text"
              value={displayValue}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="form-control"
            />
          )
        ) : (
          <div>
            {displayValue.split("\n").map((line, i) => (
              <p key={i} className="mb-0">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderElement = (element) => {
    if (element.type === "row") {
      return <RowElement key={element.id} element={element} />;
    }
    return <FormElement key={element.id} element={element} />;
  };

  return (
    <div className="document-editor container mt-4">
      <div className="a4-page">
        <div className="row align-items-center mb-3">
          <div className="col-6" style={getElementStyles("date")}>
            {renderEditableField("date", document.date)}
          </div>
          <div className="col-6">
            <div
              className={`logo-section ${
                selectedElementId === logoId ? "border border-primary" : ""
              }`}
              style={getLogoStyles()}
            >
              <label className="logo-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />
                {logo ? (
                  <img
                    src={logo}
                    alt="Company Logo"
                    className={`company-logo editable ${
                      selectedElementId === logoId ? "selected" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      width: documentContent?.logoWidth
                        ? `${documentContent.logoWidth}px`
                        : "100px",
                      height: documentContent?.logoHeight
                        ? `${documentContent.logoHeight}px`
                        : "50px",
                    }}
                    onClick={handleLogoClick}
                  />
                ) : (
                  <div
                    className={`logo-placeholder ${
                      selectedElementId === logoId ? "selected" : ""
                    }`}
                    onClick={handleLogoClick}
                  >
                    Upload Logo
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        {elements.map((element) => renderElement(element))}
        <div style={getElementStyles("companyName")}>
          {renderEditableField("companyName", document.companyName)}
        </div>
        <div style={getElementStyles("addresses")}>
          {renderEditableField(
            "addresses",
            document.addresses.join("\n"),
            true
          )}
        </div>
        <div style={getElementStyles("accordiaAddress")}>
          {renderEditableField(
            "accordiaAddress",
            document.accordiaAddress,
            true
          )}
        </div>
        <div style={getElementStyles("title")}>
          {renderEditableField("title", document.title)}
        </div>
        <div style={getElementStyles("recipient")}>
          {renderEditableField("recipient", document.recipient)}
        </div>
        <div style={getElementStyles("body")}>
          {renderEditableField("body", document.body, true)}
        </div>
        <div style={getElementStyles("footer")}>
          {renderEditableField("footer", document.footer, true)}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
