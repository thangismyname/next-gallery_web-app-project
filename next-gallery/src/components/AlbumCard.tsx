"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Album } from "@/types/types";

interface AlbumCardProps {
  album: Album;
  autoplayInterval?: number; // in ms
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  autoplayInterval = 2500,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Autoplay only when hovered
  useEffect(() => {
    if (!isHovered || album.photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % album.photos.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isHovered, album.photos.length, autoplayInterval]);

  return (
    <HoverCard
      openDelay={200}
      closeDelay={200}
      onOpenChange={(open) => {
        setIsHovered(open);
        if (!open) setCurrentIndex(0); // reset when un-hovered
      }}
    >
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

      {/* Hover Popup */}
      <HoverCardContent className="w-72 md:w-96 h-48 p-0 bg-background border shadow-lg overflow-hidden">
        <div
          ref={sliderRef}
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            width: `${album.photos.length * 100}%`,
            transform: `translateX(-${
              currentIndex * (100 / album.photos.length)
            }%)`,
          }}
        >
          {album.photos.map((photo) => (
            <img
              key={photo._id}
              src={photo.previewUrl}
              alt={photo.originalName}
              className="object-cover w-full h-full"
              style={{ width: `${100 / album.photos.length}%` }}
            />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AlbumCard;
