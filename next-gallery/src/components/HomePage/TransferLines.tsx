import React from "react";
import { useTranslation } from "react-i18next";

const TransferLines: React.FC = () => {
  const { t } = useTranslation();
  const lineText = t("homepage.transfer_line");

  return (
    <div className="w-full overflow-hidden border-t border-b py-2 select-none relative">
      <div className="flex flex-nowrap animate-scroll">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="flex-shrink-0 whitespace-nowrap mr-16 text-lg font-medium"
          >
            {lineText}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TransferLines;
