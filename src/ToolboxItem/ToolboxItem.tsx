import { useDraggable } from "@dnd-kit/core";
import { getDraggedElement } from "../components/DragOverlayWrapper/DragOverlayWrapper";
import './ToolboxItem.css';

function ToolboxItem({ id }: { id: string}) {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });
    const element = getDraggedElement(id.split('-')[0], {id})

    return (
        <div className="toolbox-item"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            {element}
        </div>
    );
}

export default ToolboxItem