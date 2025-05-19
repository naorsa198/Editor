import React from "react";

export default function DraggableTextItem({
  id,
  data,
  onTextChange,
  onFocus,
  onBlur,
}: {
  id: string;
  data?: { text?: string };
  onTextChange?: (id: string, text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <textarea
      className="dragoverlay-textarea"
      value={data?.text || ""}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={e => onTextChange?.(id, e.target.value)}
      placeholder="Write here..."
    />
  );
}