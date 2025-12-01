"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload, Folder, Share, CheckCircle } from "lucide-react";

interface Step {
  icon: React.ElementType; // store the component type
  title: string;
  description: string;
}

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  const steps: Step[] = [
    {
      icon: Upload,
      title: t("how_it_works.step1_title"),
      description: t("how_it_works.step1_desc"),
    },
    {
      icon: Folder,
      title: t("how_it_works.step2_title"),
      description: t("how_it_works.step2_desc"),
    },
    {
      icon: Share,
      title: t("how_it_works.step3_title"),
      description: t("how_it_works.step3_desc"),
    },
    {
      icon: CheckCircle,
      title: t("how_it_works.step4_title"),
      description: t("how_it_works.step4_desc"),
    },
  ];

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12">
        {t("how_it_works.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon; // dynamically render icon
          return (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <Icon className="w-12 h-12 text-primary mb-4" />

              <CardHeader className="w-full p-0">
                <CardTitle className="text-2xl font-bold mb-2">
                  {step.title}
                </CardTitle>
              </CardHeader>

              <CardDescription className="text-muted-foreground w-full">
                {step.description}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection;
