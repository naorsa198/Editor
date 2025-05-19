import { useDraggable } from "@dnd-kit/core";
import { getDraggedElement } from "../DragOverlayWrapper/DragOverlayWrapper";
import { useState } from "react";
import "./DraggableItem.css";

function DraggableItem({
    id,
    type,
    x,
    y,
    dragEnabled,
    rightClicked,
    selected,
    onFocus,
    data,
    onTextChange,
    onImageChange,
    onContextMenu,
}: {
    id: string;
    type: string;
    x: number;
    y: number;
    dragEnabled: boolean;
    rightClicked: boolean;
    selected: boolean;
    onFocus: (id: string) => void;
    data?: { text?: string; src?: string, width?: number, height?: number };
    onTextChange?: (id: string, text: string) => void;
    onImageChange?: (id: string, src: string) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
}) {
    const [isFocused, setIsFocused] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled: !dragEnabled || isFocused });

    let className = "draggable-item";
    if (selected) className += " selected";
    if (rightClicked) className += " right-clicked";
    if (isFocused) className += " is-focused";
    if (isDragging) className += " dragging";

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={{
                left: x,
                top: y,
                transform: transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
            }}
            onContextMenu={onContextMenu}
            onFocus={() => onFocus(id)}
            onBlur={() => onFocus('')}
        >
            <div
                {...attributes}
                {...listeners}
                className="draggable-item-content"
            >
                {getDraggedElement(type, {
                    id,
                    data,
                    onTextChange,
                    onImageChange,
                    onFocus: () => setIsFocused(true),
                    onBlur: () => setIsFocused(false)
                })}
            </div>
        </div>
    );
}

export default DraggableItem;
