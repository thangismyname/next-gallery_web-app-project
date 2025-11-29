"use client";

import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../theme/appcontext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const context = useContext(AppContext);

  if (!context)
    throw new Error("Newsletter must be used within an AppProvider");

  const handleSubscribe = () => {
    if (!email.trim()) {
      alert(t("newsletter.error_invalid_email"));
      return;
    }
    alert(t("newsletter.subscribed_message", { email }));
    setEmail("");
  };

  return (
    <div className="w-full border-t bg-background text-foreground py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT: Text */}
        <div className="text-lg font-semibold text-center md:text-left">
          {t("newsletter.subscribe_text")}
        </div>

        {/* RIGHT: Input + Button */}
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <Input
            type="email"
            placeholder={t("newsletter.email_placeholder")!}
            className="w-full md:w-72 font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={handleSubscribe} className="flex items-center gap-2">
            {t("newsletter.subscribe_button")}
            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
