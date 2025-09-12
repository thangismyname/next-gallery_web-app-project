import React from "react";
import { useTranslation } from "react-i18next";

const GalleryDescription: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl h-[20vh] relative overflow-hidden mx-auto">
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold font-inter">
        {t("homepage.creator_credit")}
      </div>
    </div>
  );
};

export default GalleryDescription;
