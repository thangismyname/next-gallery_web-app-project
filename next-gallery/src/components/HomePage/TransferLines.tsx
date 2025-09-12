import React from "react";
import { useTranslation } from "react-i18next";

const TransferLines: React.FC = () => {
  const { t } = useTranslation();
  const lineText = t("homepage.transfer_line");

  return (
    <div className="transfer-lines-container">
      <div className="transfer-lines animate-scroll">
        {/* Repeat text enough times for seamless scroll */}
        {[...Array(20)].map((_, i) => (
          <span key={i} className="transfer-line">
            {lineText}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TransferLines;
