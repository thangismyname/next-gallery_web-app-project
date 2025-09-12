import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const CreatorCredit: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const credit = document.querySelector(".creator-credit");
      if (credit) credit.classList.add("fade-out");
    }, 3000); // Display for 3 seconds, then fade out
    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      className="creator-credit text-xl mb-4 text-center opacity-0 animate-fade-in"
      style={{ animationDelay: "3.5s" }}
    >
      Creator: M1_Mondat
    </p>
  );
};

export default CreatorCredit;
