// src/components/LegalLinks.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type LinkKey = "terms_conditions" | "shipping_returns" | "privacy_policy";

interface LegalLinksProps {
  show?: LinkKey[]; // which links to show
  vertical?: boolean; // vertical or horizontal layout
  className?: string; // additional styling
}

const LegalLinks: React.FC<LegalLinksProps> = ({
  show = ["terms_conditions", "shipping_returns", "privacy_policy"],
  vertical = true,
  className,
}) => {
  const { t } = useTranslation();

  const allLinks: Record<LinkKey, string> = {
    terms_conditions: "/terms",
    shipping_returns: "/shipping-returns",
    privacy_policy: "/privacy",
  };

  return (
    <div
      className={`${
        vertical ? "flex flex-col gap-1" : "flex gap-4"
      } ${className}`}
    >
      {show.map((key) => (
        <a
          key={key}
          href={allLinks[key]}
          className={`text-base font-semibold hover:text-blue-600 transition-colors`}
        >
          {t(`footer.${key}`)}
        </a>
      ))}
    </div>
  );
};

export default LegalLinks;
