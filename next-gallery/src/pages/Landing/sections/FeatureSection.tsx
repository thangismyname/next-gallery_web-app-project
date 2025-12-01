"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  {
    titleKey: "homepage.feature_high_quality_title",
    descriptionKey: "homepage.feature_high_quality_desc",
    icon: <CheckCircle className="w-8 h-8" />,
  },
  {
    titleKey: "homepage.feature_album_title",
    descriptionKey: "homepage.feature_album_desc",
    icon: <CheckCircle className="w-8 h-8" />,
  },
  {
    titleKey: "homepage.feature_sharing_title",
    descriptionKey: "homepage.feature_sharing_desc",
    icon: <CheckCircle className="w-8 h-8" />,
  },
  {
    titleKey: "homepage.feature_secure_title",
    descriptionKey: "homepage.feature_secure_desc",
    icon: <CheckCircle className="w-8 h-8" />,
  },
];

const CoreFeatureSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-18 py-16">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        {t("homepage.core_features_title") || "Core Features"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {feature.icon}
                <CardTitle className="text-lg font-semibold">
                  {t(feature.titleKey)}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {t(feature.descriptionKey)}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CoreFeatureSection;
