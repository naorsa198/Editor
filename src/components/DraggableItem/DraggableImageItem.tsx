import React from "react";

const defaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";

export default function DraggableImageItem({
  id,
  data,
  onImageChange,
  onFocus,
  onBlur,
}: {
  id: string;
  data?: { src?: string };
  onImageChange?: (id: string, src: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <div className="dragoverlay-image-container">
      <img
        className="dragoverlay-image"
        src={data?.src || defaultImageUrl}
        alt=""
      />
      <div className="dragoverlay-image-label">
        {data?.src ? "" : "Drag to upload"}
      </div>
      {onImageChange && (
        <input
          type="file"
          accept="image/*"
          onPointerDown={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = ev => onImageChange(id, ev.target?.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />
      )}
    </div>
  );
}