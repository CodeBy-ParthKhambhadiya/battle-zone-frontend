"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import { X } from "lucide-react";

export default function CropperModal({ imageSrc, onCancel, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  // Modal colors
  const [modalColor] = useState({
    bgColor: "#0D1117",   // dark background
    textColor: "#00E5FF", // glowing cyan
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: modalColor.bgColor,
          color: modalColor.textColor,
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 font-semibold text-lg sm:text-xl flex justify-between items-center">
          <span>Crop Image</span>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
            style={{
              backgroundColor: modalColor.textColor,
              color: modalColor.bgColor,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-80 sm:h-96 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* Zoom Slider */}
        <div className="px-6 py-4 w-full flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1 rounded-lg accent-cyan-400"
          />
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${modalColor.textColor}`,
              color: modalColor.textColor,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = modalColor.textColor;
              e.target.style.color = modalColor.bgColor;
              e.target.style.boxShadow = `0 0 10px ${modalColor.textColor}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = modalColor.textColor;
              e.target.style.boxShadow = "none";
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleDone}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md"
            style={{
              backgroundColor: modalColor.textColor,
              color: modalColor.bgColor,
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = `0 0 15px ${modalColor.textColor}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "none";
            }}
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
