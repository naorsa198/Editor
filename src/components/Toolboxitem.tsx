import { useDraggable } from "@dnd-kit/core";
import { getDraggedElement } from "./DragOverlayWrapper";


function ToolboxItem({ id, label, src }: { id: string; label: string, src?: string | null}) {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    const element = getDraggedElement(id.split('-')[0])

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            {element}
        </div>
    );
}

export default ToolboxItem