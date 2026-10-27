"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut } from "react-icons/fi";
import type { Product } from "@/app/types/shop";

const FALLBACK_IMAGE = "/categories/mass-gainer.jpg";

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.image || FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const didDrag = useRef(false);
  const activeImage = failedImages.includes(activeIndex)
    ? FALLBACK_IMAGE
    : images[activeIndex];

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    setZoomed((current) => {
      if (current) setPosition({ x: 0, y: 0 });
      return !current;
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed || event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    };
    didDrag.current = false;
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const x = dragStart.current.x + event.clientX - dragStart.current.pointerX;
    const y = dragStart.current.y + event.clientY - dragStart.current.pointerY;
    if (Math.abs(x - dragStart.current.x) > 3 || Math.abs(y - dragStart.current.y) > 3) {
      didDrag.current = true;
    }
    setPosition({ x, y });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  const changeImage = (direction: number) => {
    selectImage((activeIndex + direction + images.length) % images.length);
  };

  const changeThumbnail = (direction: number) => {
    const nextIndex = (activeIndex + direction + images.length) % images.length;
    selectImage(nextIndex);
  };

  return (
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[64px_1fr] lg:gap-6">
      <div className="order-2 flex min-w-0 items-center gap-2 lg:order-1 lg:flex-col">
        <button type="button" aria-label="Previous preview" onClick={() => changeThumbnail(-1)} className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-navy shadow-sm lg:rotate-90"><FiChevronLeft /></button>
        <div className="flex min-w-0 max-w-full gap-3 overflow-x-auto lg:max-h-125.5 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
        {images.map((source, index) => (
          <button
            key={`${source}-${index}`}
            ref={(element) => { thumbnailRefs.current[index] = element; }}
            type="button"
            aria-label={`View product image ${index + 1}`}
            aria-pressed={activeIndex === index}
            onClick={() => selectImage(index)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white ${activeIndex === index ? "border-2 border-green-500" : "border border-line"}`}
          >
            <Image
              src={failedImages.includes(index) ? FALLBACK_IMAGE : source}
              alt=""
              fill
              onError={() => setFailedImages((current) => [...new Set([...current, index])])}
              className={`object-contain p-1 ${activeIndex === index ? "" : "opacity-70"}`}
            />
          </button>
        ))}
        </div>
        <button type="button" aria-label="Next preview" onClick={() => changeThumbnail(1)} className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-navy shadow-sm lg:rotate-90"><FiChevronRight /></button>
      </div>

      <div
        className={`order-1 relative flex min-h-90 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-white to-[#f4f9fc] sm:min-h-125 lg:order-2 ${zoomed ? "touch-none" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority
          onError={() => {
            setFailedImages((current) => [...new Set([...current, activeIndex])]);
          }}
          className={`object-contain p-8 select-none sm:p-12 ${zoomed ? `scale-150 ${dragging ? "cursor-grabbing" : "cursor-grab"}` : "cursor-zoom-in"} ${dragging ? "transition-none" : "transition-transform duration-300"}`}
          style={zoomed ? { transform: `translate(${position.x}px, ${position.y}px) scale(1.5)` } : undefined}
          draggable={false}
          onClick={() => {
            if (!didDrag.current) toggleZoom();
            didDrag.current = false;
          }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              toggleZoom();
            }}
            className="relative z-20 flex size-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm"
          >
            {zoomed ? <FiZoomOut /> : <FiZoomIn />}
          </button>
        </div>
        <button type="button" aria-label="Previous product image" onClick={() => changeImage(-1)} className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm"><FiChevronLeft /></button>
        <button type="button" aria-label="Next product image" onClick={() => changeImage(1)} className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm"><FiChevronRight /></button>
        <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] text-slate-soft">
          {zoomed ? <FiZoomOut /> : <FiZoomIn />} {zoomed ? "Click to zoom out" : "Click image to zoom"}
        </span>
      </div>
    </div>
  );
}
