import React, { useEffect, useState } from "react";
import RowElement from "./RowElement";
import FormElement from "./FormElement";
import { useSelector, useDispatch } from "react-redux";
import { updateDocumentContent, selectElement } from "../redux/templateSlice";

const Doc = () => {
  const dispatch = useDispatch();
  const [logo, setLogo] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const initialDocument = {
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
    listItems: [
      "In the case of multi-site certificates, if the certified organization demonstrates a systemic failure in meeting SA8000:2014 requirements, then Accordia will review whether the certified organization should have their multi-site certification canceled.",
      "The client agrees to provide full access during working hours (including night shift) to Accordia and/or SAAS Audit team to client organization's premises, employees and documents enabling the team to conduct Special Audits (on announced, semi-announced and unannounced basis) in compliance with SAAS Accreditation requirements.",
      "Client agrees to abide by all terms & conditions for SA 8000 certification and audit process defined in SAAS Procedures, 200, 200A, 201A and any advisories issued by SAAS from time to time.",
      "The client gives permission to make copies of documents, to take photographs of non-proprietary processes and at locations around the site as required by the SA 8000 audit process. Such information and other confidential SA 8000 audit outcomes will remain confidential and will only be shared with SAAS and SAI as part of the oversight system.",
      "Client understands and agrees to share and allow Accordia to share audit information for Transfer purpose as required by SAAS Procedure 200",
      "Client confirms to have read, understood and agree to comply with the Certification Rules available on Accordia website www.accordiausa.com. These rules are part of the certification service quotation",
    ],
  };

  const [document, setDocument] = useState(initialDocument);

  const elementIds = {
    logo: "logo-element",
    date: "date-element",
    companyName: "company-name-element",
    addresses: "addresses-element",
    accordiaAddress: "accordia-address-element",
    title: "title-element",
    recipient: "recipient-element",
    body: "body-element",
    sections: "sections-element",
    footer: "footer-element",
  };

  const documentContent = useSelector(
    (state) => state.template.documentContent || {}
  );

  const handleTextChange = (field, value) => {
    setDocument((prev) => ({
      ...prev,
      [field]: value,
    }));
    dispatch(updateDocumentContent({ field, value }));
  };

  const renderElement = (element) => {
    if (element.type === "row") {
      return <RowElement key={element.id} element={element} />;
    }
    return <FormElement key={element.id} element={element} />;
  };

  const spacingToCss = (spacingObj) => {
    const spacing = parseSpacingValue(spacingObj);
    return `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`;
  };

  const parseSpacingValue = (value) => {
    if (!value) return { top: 0, right: 0, bottom: 0, left: 0 };

    if (typeof value === "string") {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    if (typeof value === "object") {
      return {
        top: value.top || 0,
        right: value.right || 0,
        bottom: value.bottom || 0,
        left: value.left || 0,
      };
    }

    return { top: 0, right: 0, bottom: 0, left: 0 };
  };

  const getElementStyles = (field) => {
    if (!documentContent?.styles) return {};

    const fieldStyles = documentContent.styles[field] || {};
    const margin = parseSpacingValue(fieldStyles.margin);
    const padding = parseSpacingValue(fieldStyles.padding);
    const textAlign = fieldStyles.textAlign || "left";

    return {
      margin: spacingToCss(margin),
      padding: spacingToCss(padding),
      display: fieldStyles.display || "block",
      textAlign: textAlign,
    };
  };

  const elements = useSelector((state) => state.template.elements || []);

  const selectedElementId = useSelector(
    (state) => state.template.selectedElementId
  );

  const renderEditableField = (field, value, isMultiline = false) => {
    const fieldStyles = documentContent?.styles?.[field] || {};
    const isSelected = selectedElementId === `document-${field}`;
    const margin = parseSpacingValue(fieldStyles.margin);
    const padding = parseSpacingValue(fieldStyles.padding);

    const displayValue = documentContent[field] || value;

    const handleClick = (e) => {
      e.stopPropagation();
      dispatch(selectElement(`document-${field}`));
    };

    return (
      <div
        className={`editable-field ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
        style={{
          margin: spacingToCss(margin),
          padding: spacingToCss(padding),
          display: fieldStyles.display || "block",
          flexGrow: fieldStyles.flex?.grow || "initial",
          cursor: "pointer",
        }}
      >
        {editingField === field ? (
          isMultiline ? (
            <textarea
              value={displayValue}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={displayValue}
              onChange={(e) => handleTextChange(field, e.target.value)}
              onBlur={() => setEditingField(null)}
              autoFocus
            />
          )
        ) : (
          <div>
            {displayValue.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getLogoStyles = () => {
    const alignment = documentContent?.logoAlignment || "right";
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
      margin: `${logoMargin.top}px ${logoMargin.right}px ${logoMargin.bottom}px ${logoMargin.left}px`,
      padding: `${logoPadding.top}px ${logoPadding.right}px ${logoPadding.bottom}px ${logoPadding.left}px`,
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
      case "left":
        return {
          ...alignmentStyle,
          marginLeft: logoMargin.left + "px",
          marginRight: "auto",
          display: "block",
          textAlign: "left",
        };
      default:
        return {
          ...alignmentStyle,
          marginLeft: "auto",
          marginRight: logoMargin.right + "px",
          display: "block",
          textAlign: "right",
        };
    }
  };

  const handleElementSelect = (elementId) => (e) => {
    e.stopPropagation();
    dispatch(selectElement(elementId));
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

  return (
    <>
      <div className="a4-page">
        {elements.map((element, index) => renderElement(element, index))}

        <div className="page-styling mx-5 mb-3">
          <div className="row align-items-center">
            <div style={getElementStyles("date")} className="col-6">
              <p>{renderEditableField("date", document.date)}</p>
            </div>
            <div className="col-6">
              <div
                className={`mb-3 ${
                  selectedElementId === elementIds.logo
                    ? "border border-primary"
                    : ""
                }`}
                style={getLogoStyles()}
              >
                <img
                  src="./logo.png"
                  alt="Company Logo"
                  className={`company-logo editable ${
                    selectedElementId === elementIds.logo ? "selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    width: documentContent?.logoWidth
                      ? `${documentContent?.logoWidth}px`
                      : "auto",
                    height: documentContent?.logoHeight
                      ? `${documentContent?.logoHeight}px`
                      : "auto",
                  }}
                  onClick={handleElementSelect(elementIds.logo)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div style={getElementStyles("companyName")}>
                {renderEditableField("companyName", document.companyName)}
              </div>
              <p className="fw-bold normalTextPdf"></p>
              <p className="fw-bold normalTextPdf">Vietnam</p>
              <p className="fw-bold normalTextPdf">Hưng Yên, Hung Yên</p>
              <p className="fw-bold normalTextPdf">32400, Vietnam</p>
            </div>
            <div className="col">
              <div className="text-end">
                <p
                  className="fw-bold"
                  style={{ margin: "0", padding: "0", color: "grey" }}
                >
                  ACCORDIA GLOBAL COMPLIANCE GROUP VIETNAM
                </p>
                <p className="fw-bold normalTextPdfWithBlueColor">
                  Room 3, Floor 6, No 23B, Road No 3, Block 2, An Khanh
                </p>
                <p className="fw-bold normalTextPdfWithBlueColor">
                  Thủ Đức, Ho Chi Minh
                </p>
                <p className="fw-bold normalTextPdfWithBlueColor">Vietnam</p>
              </div>
            </div>
          </div>
          <div className="col my-3">
            <h5 className="fw-600">
              Quotation for SMETA (FULL INITIAL AUDIT) Certivcation Sersicey
            </h5>
          </div>
          <div className="col my-3">
            <h5 className="fw-600">DR Umair</h5>
          </div>
          <div style={getElementStyles("body")} className="col my-3">
            <p>{renderEditableField("body", document.body)}</p>
          </div>
          <div className="col my-3">
            <p>
              We are pleased to reply to your recent inquiry regarding
              <span className="fw-bold">Service Acquired</span> audit with our
              Quotation For Services (QFS). Should you have any questions that
              the QFS does not answer, our managers would be pleased to take
              your call and discuss any matters with you.
            </p>
          </div>
          <div className="col my-3">
            <p className="px-5">
              <span className="fw-bold">Part 1</span> – Provides the cost
              details for your services as well as the length, on days, of your
              audit
            </p>
          </div>
          <div className="col my-3">
            <p className="px-5">
              <span className="fw-bold">Part 2</span> – Provides the scope of
              the audit and site(s) details
            </p>
          </div>
          <div className="col my-3">
            <p>
              Accepting our quotation is a matter of signing at the bottom of
              Page 4, in the section Client Acceptance You may scan and email
              both pages to the Accordia office or send by fax, if you prefer
            </p>
          </div>
          <div className="col my-3">
            <p>Next Steps:</p>
          </div>
          <div className="col px-5">
            <p className="normalTextPdf">
              <span className="fw-bold">
                <span className="dots"></span>
              </span>
              Pay the audit fee prior to the audit
            </p>
            <p className="normalTextPdf">
              <span className="fw-bold">
                <span className="dots"></span>
              </span>
              Select accordia Asia on SMETA Database
            </p>
            <p className="normalTextPdf">
              <span className="fw-bold">
                <span className="dots"></span>
              </span>
              Our scheduler will then contact you for planning onsite audit
            </p>
          </div>
          <div className="col my-3">
            <p>Special Information</p>
          </div>
          <div className="col my-3">
            <div></div>
          </div>
          <div className="col my-4">
            <p className="normalTextPdf">Sincerely, </p>
            <p className="normalTextPdf">Andy zoan</p>
          </div>
          <br />
          <br />
          <div className="col my-3 mt-4">
            <p className="normalTextPdf">
              This proposal is considered confidential property of Accordia
              Global Compliance Group and is intended for the sole use of and is
              not be shared outside of either organization
            </p>
          </div>
        </div>
      </div>
      <div className="a4-page">
        <div className="page-styling mx-5 mb-3">
          <div className="row mt-3 QuotationHeadingCustompadding">
            <div className="d-flex customer flex-column col-lg-12 col-12 ps-1 pe-1 mb-3 mx-2">
              <div className="row text-center headingBackground py-1 me-4 ms-0 d-flex justify-content-center align-items-center">
                <h3 className="text-white">QUOTATION</h3>
              </div>
            </div>
          </div>

          <div className="row ps-1">
            <div className="col mt-3 mx-2 pe-2">
              <h5 className="fw-600">
                Quotation Number : QUO-LO_VNM-351/14789/3019_rv1
              </h5>
            </div>
            <div className="col mt-3 mx-1 pe-4 text-end">
              <h5 className="fw-600 pe-2">26 February 2025</h5>
            </div>
          </div>
          <div className="col my-3 mx-2 pe-2 ps-1">
            <h5 className="fw-600">PART I CLIENT-INFORMATION</h5>
          </div>

          <div className="d-flex customer flex-column col-lg-12 col-12 ps-1 pe-3 my-3">
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Company Name:</span>
              </div>
              <div className="col-9 personalBorder">
                <span>ABC Corp</span>
              </div>
            </div>

            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Company Address</span>
              </div>
              <div className="col-9 personalBorder">
                <span>123 Main St, Suite 100, Cityville</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">City</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Cityville</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">State/Province</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Stateville</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Country</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Countryland</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Postal Code</span>
              </div>
              <div className="col-3 personalBorder">
                <span>12345</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Phone No.</span>
              </div>
              <div className="col-3 personalBorder">
                <span>+1234567890</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Email</span>
              </div>
              <div className="col-3 personalBorder">
                <span>contact@abccorp.com</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Website</span>
              </div>
              <div className="col-3 personalBorder">
                <span>www.abccorp.com</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">VAT Tax/ No</span>
              </div>
              <div className="col-3 personalBorder">
                <span>VAT123456</span>
              </div>
            </div>

            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Contact Name</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Mr. John Doe</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Contact No.</span>
              </div>
              <div className="col-3 personalBorder">
                <span>+1234567890</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Contact Email</span>
              </div>
              <div className="col-3 personalBorder">
                <span>john.doe@abccorp.com</span>
              </div>
            </div>
          </div>

          <div className="col mt-3 mx-2 pe-2">
            <h5 className="fw-600">PART II SERVICE-INFORMATION</h5>
          </div>

          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-1 my-3 ms-2 me-4">
            <div className="row text-center heading-border py-1 me-4 ms-1 d-flex justify-content-center align-items-center">
              <h5 className="fw-600">Service Acquired: Audit</h5>
            </div>
          </div>

          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">PART III SITE-INFORMATION</h5>
          </div>

          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3 mx-1">
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Site Name:</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Site A</span>
              </div>
            </div>

            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Site Address:</span>
              </div>
              <div className="col-9 personalBorder">
                <span>456 Another St, Suite 200, Townsville</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">City</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Townsville</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">State Province</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Provinceville</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Country</span>
              </div>
              <div className="col-3 personalBorder">
                <span>Countryland</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Postal Code</span>
              </div>
              <div className="col-3 personalBorder">
                <span>67890</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Phone No.</span>
              </div>
              <div className="col-3 personalBorder">
                <span>+0987654321</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Email</span>
              </div>
              <div className="col-3 personalBorder">
                <span>sitea@abccorp.com</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Website</span>
              </div>
              <div className="col-3 personalBorder">
                <span>www.sitea.com</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Vat Tax/ No</span>
              </div>
              <div className="col-3 personalBorder">
                <span>VAT67890</span>
              </div>
            </div>

            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Scope Of Certification</span>
              </div>
              <div className="col-9 personalBorder">
                <span>ISO 9001</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Workers</span>
              </div>
              <div className="col-3 personalBorder">
                <span>150</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">No of Shifts</span>
              </div>
              <div className="col-3 personalBorder">
                <span>2</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Primary Process</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Manufacturing</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Secondary Process</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Packaging</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Products</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Widgets</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Facility Size</span>
              </div>
              <div className="col-3 personalBorder">
                <span>5000 sq ft</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Facility Covered Area</span>
              </div>
              <div className="col-3 personalBorder">
                <span>3000 sq ft</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Representative Name</span>
              </div>
              <div className="col-9 personalBorder">
                <span>Ms. Jane Smith</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-3 personalBorder">
                <span className="fw-bold">Representative Contact No</span>
              </div>
              <div className="col-3 personalBorder">
                <span>+0987654321</span>
              </div>
              <div className="col-3 personalBorder">
                <span className="fw-bold">Representative Email</span>
              </div>
              <div className="col-3 personalBorder">
                <span>jane.smith@sitea.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="a4-page">
        <div className="page-styling mx-5 mb-3">
          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">PART IV COST</h5>
          </div>
          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">
              Audit Charges For Service Acquired are as follows:
            </h5>
          </div>

          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3 personalPaddingClass">
            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-6 personalBorder text-center headingBackground">
                <span className="fw-bold">Fee (Descriptions)</span>
              </div>
              <div className="col-2 personalBorder text-center headingBackground">
                <span className="fw-bold">Audit Days</span>
              </div>
              <div className="col-2 personalBorder text-center headingBackground">
                <span className="fw-bold">Rate</span>
              </div>
              <div className="col-2 personalBorder text-center headingBackground">
                <span className="fw-bold">Audit Fee</span>
              </div>
            </div>

            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-6 personalBorder text-center">
                <span>Fee Name 1</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>5</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>USD 100</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>USD 500</span>
              </div>
            </div>

            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-6 personalBorder text-center">
                <span>Fee Name 2</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>3</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>USD 150</span>
              </div>
              <div className="col-2 personalBorder text-center">
                <span>USD 450</span>
              </div>
            </div>

            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-4 text-end personalBorderwithoutRight">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutLeft">
                <span className="fw-bold">Total Amount</span>
              </div>
              <div className="col-2 text-center personalBorder">
                <span className="fw-bold">USD 950</span>
              </div>
            </div>

            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-4 text-end personalBorderwithoutRight">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutLeft">
                <span className="fw-bold">Applicable Taxes</span>
              </div>
              <div className="col-2 text-center personalBorder">
                <span className="fw-bold">USD 50</span>
              </div>
            </div>

            <div className="row mx-1 d-flex justify-content-center">
              <div className="col-4 text-end personalBorderwithoutRight">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutx">
                <span className="fw-bold"></span>
              </div>
              <div className="col-2 text-end personalBorderwithoutLeft">
                <span className="fw-bold">Total Amount (After Tax)</span>
              </div>
              <div className="col-2 text-center personalBorder">
                <span className="fw-bold">USD 1000</span>
              </div>
            </div>
          </div>

          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">Fees And Payments</h5>
          </div>
          <div className="row my-3">
            <div className="col mx-4">
              <ol type="a">
                <li>
                  Total Fee Cost for third party certification services must be
                  paid prior to conducting the audit services.
                </li>
                <li>
                  Client will pay for the service prior to conducting the audit,
                  unless other payment arrangements have been previously agreed.
                </li>
                <li>
                  Client shall not be entitled to retain or defer payment of any
                  sums due on account of any dispute, counterclaim or set-off.
                </li>
                <li>
                  May elect to bring an action for the collection of unpaid fees
                  in any court having competent jurisdiction.
                </li>
                <li>
                  Client shall pay all collection costs, including attorney’s
                  fees and related costs.
                </li>
                <li>
                  In the event any unforeseen problems or expenses arise in the
                  course of carrying out the services, additional fees may be
                  charged.
                </li>
                <li>
                  If unable to perform all or part of the services for any cause
                  outside control, payment of non-refundable expenses and fees
                  may still be required.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="a4-page">
        <div className="page-styling mx-5 mb-3">
          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">
              PART V AUDIT DURATION For SA 8000 Certification Terms & Conditions
            </h5>
            <div className="row my-3">
              <div className="col mx-4">
                <ol type="a">
                  {document.listItems &&
                    document.listItems.map((item, index) => (
                      <li key={index} style={getElementStyles("listItems")}>
                        {renderEditableField(`listItems[${index}]`, item, true)}
                      </li>
                    ))}
                </ol>
              </div>
            </div>
          </div>
          <h5 className="fw-600">WRAP</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">No Of Workers</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">Audit Days</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>1 - 50</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>2</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>51 - 100</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>3</span>
              </div>
            </div>
          </div>
          <h5 className="fw-600">HIGG INDEX FEM 4.0 VERIFICATION</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">Production Process</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">Number Of Employee</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">No of Audit Days</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-4 personalBorder text-center">
                <span>Process A</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>1 - 50</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>2</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-4 personalBorder text-center">
                <span>Process B</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>51 - 100</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>3</span>
              </div>
            </div>
          </div>
          <h5 className="fw-600">CTPAT</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">Facility Size</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">No of Audit Days</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>Small</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>1</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>Medium</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>2</span>
              </div>
            </div>
          </div>
          <h5 className="fw-600">SLCP</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">Number of Employees</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">No of Audit Days</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>1 - 50</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>2</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>51 - 100</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>3</span>
              </div>
            </div>
          </div>
          <h5 className="fw-600">Gildan CSR</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">Number of Employees</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span className="fw-bold">No of Audit Days</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>1 - 50</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>2</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-6 personalBorder text-center">
                <span>51 - 100</span>
              </div>
              <div className="col-6 personalBorder text-center">
                <span>3</span>
              </div>
            </div>
          </div>
          <h5 className="fw-600">SMETA</h5>
          <div className="d-flex customer flex-column col-lg-12 col-12 ps-0 pe-3 my-3">
            <div className="row mx-2 headingBackground">
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">Column 1</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">Audit Days</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span className="fw-bold">Column 3</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-4 personalBorder text-center">
                <span>Data 1</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>2</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>Data 3</span>
              </div>
            </div>
            <div className="row mx-2">
              <div className="col-4 personalBorder text-center">
                <span>Data 4</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>3</span>
              </div>
              <div className="col-4 personalBorder text-center">
                <span>Data 6</span>
              </div>
            </div>
          </div>
          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">Notes</h5>
          </div>
          <div className="row my-3 mx-4">
            <div className="col py-1">
              <p className="normalTextPdf">
                1. Time stated excludes audit preparation, travel, WRAP “audit
                report uploading time” and audit report writing, but includes
                production of a CAP (Corrective Action Plan) on site.
                <p>
                  2. Up to date WRAP Guidance best Practice Guidance will be
                  followed
                </p>
              </p>
            </div>
          </div>
          <div className="col my-3 mx-2 pe-2">
            <h5 className="fw-600">
              PART VI - ACCEPTANCE OF QUOTATION AND TERMS
            </h5>
          </div>
          <div className="row my-3 mx-4">
            <div className="col py-1">
              <p className="my-4">
                Accordia Certification Rules and Integrity Policy are all found
                on Accordia’s website at www.Accordiausa.com and combined with
                this Quotation all shall form the agreement between you (the
                Client) and Accordia Global Compliance Group entity (Accordia)
                providing the services. Clients engaging Accordia for third
                party certification services (e.g. SA8000 Certification) further
                agrees to Accordia Certification Rules found on the Accordia
                website www.accordiausa.com. IN WITNESS WHEREOF, Accordia and
                Client hereto have executed this Agreement as of the date
                written below.
              </p>
              <h5 className="fw-600">Client Company Name</h5>
            </div>
          </div>
          <div className="row mb-3 mx-4 mt-5">
            <div className="col py-1 fw-bold">
              Sign:{" "}
              <span className="ps-2 ms-5">
                ______________________________________
              </span>
            </div>
            <div className="col py-1 fw-bold">
              Date:{" "}
              <span className="ps-1 ms-5">
                ______________________________________
              </span>
            </div>
          </div>
          <div className="row my-3 mx-4">
            <div className="col py-1 fw-bold">
              Name:{" "}
              <span className="ps-4 ms-4">
                ______________________________________
              </span>
            </div>
            <div className="col py-1 fw-bold">
              Title:{" "}
              <span className="ps-4 ms-4">
                ______________________________________
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Doc;
