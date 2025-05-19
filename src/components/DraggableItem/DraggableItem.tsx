import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import DraggableTextItem from "./DraggableTextItem";
import DraggableImageItem from "./DraggableImageItem";
import DraggableButtonItem from "./DraggableButtonItem";
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

    let content = null;
    if (type === "text") {
        content = (
            <DraggableTextItem
                id={id}
                data={data}
                onTextChange={onTextChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        );
    } else if (type === "image") {
        content = (
            <DraggableImageItem
                id={id}
                data={data}
                onImageChange={onImageChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        );
    } else if (type === "button") {
        content = <DraggableButtonItem />;
    } else {
        content = <div>Unknown type</div>;
    }

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
                {content}
            </div>
        </div>
    );
}

export default DraggableItem;
