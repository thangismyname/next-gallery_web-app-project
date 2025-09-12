import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AnimatedTitle: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  const text = t("animated_title.next_gallery");
  const letters = text.split("");

  useEffect(() => {
    const timer = setTimeout(() => setAnimateOut(true), 2000); // animate out after 2s
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-1/5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] text-center">
      <h1 className="flex justify-center flex-nowrap whitespace-nowrap font-bold text-9xl text-center">
        <span
          className={animateOut ? "flow-out" : ""}
          onAnimationEnd={() => {
            if (animateOut) setShow(false);
          }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              className="inline-block opacity-0 animate-flow-in"
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
