import { useDraggable } from "@dnd-kit/core";
import { getDraggedElement } from "./DragOverlayWrapper";

function UndraggableItem({
    id,
    type,
    x,
    y,
}: {
    id: string;
    type: string;
    x: number;
    y: number;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: true });
    const element = getDraggedElement(id.split('-')[0])

    const style: React.CSSProperties = {
        position: 'absolute',
        left: x,
        top: y,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        cursor: 'move',
        zIndex: 100,
        padding: '4px',
        
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            {element}
        </div>
    );
}

export default UndraggableItem
