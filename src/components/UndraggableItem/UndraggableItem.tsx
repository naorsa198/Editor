import { getDraggedElement } from "../DragOverlayWrapper/DragOverlayWrapper";
import "./UndraggableItem.css";

function UndraggableItem({
    id,
    type,
    x,
    y,
    data,
}: {
    id: string;
    type: string;
    x: number;
    y: number;
    data?: { text?: string; src?: string };
}) {
    const element = getDraggedElement(type, { id, data });

    return (
        <div
            className="undraggable-item"
            style={{
                left: x,
                top: y,
            }}
        >
            {element}
        </div>
    );
}

export default UndraggableItem;
