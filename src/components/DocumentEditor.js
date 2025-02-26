import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDocumentContent, selectElement } from "../redux/templateSlice";
import RowElement from "./RowElement";
import FormElement from "./FormElement";

const DocumentEditor = () => {
  const dispatch = useDispatch();
  const documentContent = useSelector(
    (state) => state.template.documentContent
  );
  const elements = useSelector((state) => state.template.elements);
  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );

  const [editingField, setEditingField] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoId] = useState("logo-element"); // Assign a stable ID to the logo

  // Initial document structure
  const initialDocument = {
    styles: {
      date: { margin: "0", padding: "0", display: "block" },
      companyName: { margin: "0", padding: "0", display: "block" },
      addresses: { margin: "0", padding: "0", display: "block" },
      accordiaAddress: { margin: "0", padding: "0", display: "block" },
      title: { margin: "0", padding: "0", display: "block" },
      recipient: { margin: "0", padding: "0", display: "block" },
      body: { margin: "0", padding: "0", display: "block" },
      footer: { margin: "0", padding: "0", display: "block" },
      logoAlignment: { margin: "0", padding: "0", display: "block" },
      // Add styles for all document fields
    },
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
    logoAlignment: "left", // Add default logo alignment
  };

  const [document, setDocument] = useState(initialDocument);

  // Initialize document content in Redux if it's null
  useEffect(() => {
    if (!documentContent) {
      Object.entries(initialDocument).forEach(([field, value]) => {
        dispatch(updateDocumentContent({ field, value }));
      });
    }
  }, [documentContent, dispatch]);

  const handleTextChange = (field, value) => {
    setDocument((prev) => ({
      ...prev,
      [field]: value,
    }));
    dispatch(updateDocumentContent({ field, value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        // Also store logo in document content
        dispatch(
          updateDocumentContent({ field: "logo", value: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = (e) => {
    e.stopPropagation();
    dispatch(selectElement(logoId));
  };

  const getLogoAlignmentStyle = () => {
    const alignment = documentContent?.logoAlignment || "left";
    switch (alignment) {
      case "center":
        return { margin: "0 auto", display: "block", textAlign: "center" };
      case "right":
        return { marginLeft: "auto", display: "block", textAlign: "right" };
      default: // "left"
        return { marginRight: "auto", display: "block", textAlign: "left" };
    }
  };

  const renderEditableField = (field, value, isMultiline = false) => {
    const fieldStyles = documentContent?.styles?.[field] || {};
    const isSelected = selectedElementId === `document-${field}`;

    const handleClick = (e) => {
      e.stopPropagation();
      dispatch(selectElement(`document-${field}`));
    };
    return (
      <div
        className={`editable-field ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
        style={{
          margin: fieldStyles.margin,
          padding: fieldStyles.padding,
          display: fieldStyles.display,
          flexGrow: fieldStyles.flex?.grow,
          // Add other style properties
        }}
      >
        {editingField === field ? (
          isMultiline ? (
            <textarea
              value={value}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
            />
          )
        ) : (
          <div>
            {value.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
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
      {elements.map((element, index) => renderElement(element, index))}

      <div className="document-header mb-4">
        <div
          className={`logo-section mb-3 ${
            selectedElementId === logoId ? "border border-primary" : ""
          }`}
          style={getLogoAlignmentStyle()}
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
                  //   maxWidth: "200px",
                  cursor: "pointer",
                  width: documentContent.logoWidth
                    ? `${documentContent.logoWidth}px`
                    : "auto",
                  height: documentContent.logoHeight
                    ? `${documentContent.logoHeight}px`
                    : "auto",
                }}
                onClick={handleLogoClick}
              />
            ) : (
              <div className="logo-placeholder" onClick={handleLogoClick}>
                Click to upload logo
              </div>
            )}
          </label>
        </div>

        <div className="document-date mb-3">
          {renderEditableField("date", document.date)}
        </div>
      </div>

      <div className="document-body">
        <div className="company-addresses mb-4">
          <h4 className="mb-2">{document.companyName}</h4>
          {document.addresses.map((address, index) => (
            <div key={index} className="address-line">
              {renderEditableField(`addresses[${index}]`, address)}
            </div>
          ))}
        </div>

        <div className="accordia-address mb-4">
          {renderEditableField(
            "accordiaAddress",
            document.accordiaAddress,
            true
          )}
        </div>

        <h2 className="document-title mb-4">
          {renderEditableField("title", document.title)}
        </h2>

        <div className="recipient-section mb-4">
          {renderEditableField("recipient", document.recipient)}
        </div>

        <div className="document-content mb-4">
          {renderEditableField("body", document.body, true)}
        </div>

        <div className="document-sections mb-4">
          {document.sections.map((section, index) => (
            <div key={index} className="section mb-3">
              <h4 className="section-title">
                {renderEditableField(`sections[${index}].title`, section.title)}
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
          {renderEditableField("footer", document.footer, true)}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
