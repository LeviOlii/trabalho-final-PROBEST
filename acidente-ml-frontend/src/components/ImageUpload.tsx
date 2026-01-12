"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-6">
      {/* Upload */}
      <label
        htmlFor="image"
        className="cursor-pointer rounded-md border border-gray-600 bg-gray-700 py-2 text-center text-sm text-gray-200
                   hover:bg-gray-600 hover:border-gray-500 transition
                   focus-within:ring-2 focus-within:ring-blue-500"
      >
        Selecionar imagem
        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const objectURL = URL.createObjectURL(file);
              setPreview(objectURL);
            }
          }}
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="flex justify-center">
          <div className="rounded-lg overflow-hidden border border-gray-600 shadow-md">
            <Image
              src={preview}
              alt="Pré-visualização da imagem enviada"
              width={300}
              height={300}
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
