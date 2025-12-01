"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { Album } from "@/types/types";
import AlbumCard from "@/components/AlbumCard";
import { mockAlbums } from "@/mocks/mockAlbums";

interface ShowcaseSectionProps {
  albums: Album[];
}

const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ albums }) => {
  const { t } = useTranslation();

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
      {/* Section Title */}
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12">
        {t("landingpage.showcase.title")}
      </h2>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
};

export default ShowcaseSection;
