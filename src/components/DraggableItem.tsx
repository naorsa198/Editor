import { useDraggable } from "@dnd-kit/core";
import { getDraggedElement } from "./DragOverlayWrapper";

function DraggableItem({
    id,
    type,
    x,
    y,
    onContextMenu,
    dragEnabled,
    rightClicked
}: {
    id: string;
    type: string;
    x: number;
    y: number;
    dragEnabled: boolean;
    rightClicked: boolean;
    onContextMenu?: (e: React.MouseEvent) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled: !dragEnabled });
    console.log('dragging', id, isDragging)
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
        boxShadow:(isDragging || rightClicked) ? '0 8px 16px rgba(249, 3, 3, 0.25)' : 'none'
        
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} onContextMenu={onContextMenu}>
            {element}
        </div>
    );
}

export default DraggableItem
