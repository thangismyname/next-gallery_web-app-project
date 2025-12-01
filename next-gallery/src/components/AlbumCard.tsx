"use client";

import React, { useState, useEffect } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Album, Photo } from "@/types/types";

interface AlbumCardProps {
  album: Album;
  autoplayInterval?: number; // in ms
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  autoplayInterval = 2500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!album.photos || album.photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % album.photos.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [album.photos, autoplayInterval]);

  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Card className="relative overflow-hidden cursor-pointer transition-transform hover:scale-105">
          <img
            src={album.coverPhoto.previewUrl}
            alt={album.title}
            className="w-full h-56 object-cover"
          />
          <CardContent className="p-4">
            <CardTitle className="text-lg font-bold">{album.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {album.photos.length} photos
            </p>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="w-72 md:w-96 p-2 bg-background border shadow-lg flex justify-center items-center">
        {album.photos.length > 0 && (
          <img
            src={album.photos[currentIndex].previewUrl}
            alt={album.photos[currentIndex].originalName}
            className="w-full h-48 object-cover rounded-md transition-all duration-500"
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default AlbumCard;
