import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Doc from "./Doc";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PreviewMode = ({ onDownloadPDF }) => {
  const documentContent = useSelector(
    (state) => state.template.documentContent || {}
  );
  const pageRefs = useRef([]);
  const previewContainerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const adjustScale = () => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth;
      const containerHeight = window.innerHeight; // Use full viewport height
      const a4Width = 794; // A4 width in pixels
      const a4Height = 1123; // A4 height in pixels

      const widthScale = (containerWidth - 40) / a4Width; // Account for padding
      const heightScale = (containerHeight - 80) / a4Height; // Account for button and padding
      const newScale = Math.min(widthScale, heightScale, 1); // Don't scale up
      setScale(newScale > 0 ? newScale : 0.5); // Ensure scale is positive, default to 0.5 if too small
    }
  };

  useEffect(() => {
    adjustScale();
    window.addEventListener("resize", adjustScale);
    return () => window.removeEventListener("resize", adjustScale);
  }, []);

  useEffect(() => {
    const updateRefs = () => {
      const pages = document.querySelectorAll(".a4-page");
      pageRefs.current = Array.from(pages);
      pageRefs.current.forEach((page) => {
        page.style.transform = `scale(${scale})`;
        page.style.transformOrigin = "top center";
      });
    };
    updateRefs();
  }, [documentContent, scale]);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < pageRefs.current.length; i++) {
      const page = pageRefs.current[i];
      if (page) {
        page.style.transform = "scale(1)";
        page.style.transformOrigin = "top left";

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794,
          windowHeight: 1123,
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, "", "FAST");

        page.style.transform = `scale(${scale})`;
        page.style.transformOrigin = "top center";
      }
    }

    pdf.save("document.pdf");
    if (onDownloadPDF) {
      onDownloadPDF();
    }
  };

  return (
    <div className="previews-mode" ref={previewContainerRef}>
      <Doc />
      <button
        className="btn btn-primary mt-3 mb-3"
        onClick={handleDownloadPDF}
        style={{
          position: "sticky",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          marginLeft: "auto",
          display: "block",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default PreviewMode;
