import { useDroppable } from "@dnd-kit/core";
import { forwardRef } from "react";
import './CanvasArea.css';

const DropArea = forwardRef<HTMLDivElement, { children: React.ReactNode, onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>; }>(
    ({ children, onContextMenu, onMouseDown, onMouseMove, onMouseUp  }, ref) => {
        const { setNodeRef } = useDroppable({ id: 'droparea' });

        return (
            <div    
                className="drop-area"         
                onContextMenu={onContextMenu}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                ref={(node) => {
                    setNodeRef(node);
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
            >
                {children}
            </div>
        );
    });

    export default DropArea