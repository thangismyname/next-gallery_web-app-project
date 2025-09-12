import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AnimatedTitle: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  const text = t("animated_title.next_gallery");
  const letters = text.split("");

  useEffect(() => {
    const timer = setTimeout(() => setAnimateOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="animated-title-wrapper">
      <h1 className="animated-title font-bold text-center">
        <span
          className={animateOut ? "flow-out" : ""}
          onAnimationEnd={() => {
            if (animateOut) setShow(false);
          }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              className="letter animate-flow-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
};

export default AnimatedTitle;
