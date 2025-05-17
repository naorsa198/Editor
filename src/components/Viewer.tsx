import { useRef } from 'react';
import {
    DndContext,
} from '@dnd-kit/core';
import '../components/Editor/Editor.css'
import DropArea from './DropArea';
import DraggableItem from './DraggableItem';
import UndraggableItem from './UndraggableItem';

// Each toolbox item has an id and a label
const initialItems = [
    { id: 'text', label: 'Text' },
    { id: 'input', label: 'Input' },
    { id: 'button', label: 'Button' },
    { id: 'image', label: 'Image', src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }
];

type ItemData = {
    id: string;
    type: any;
    x: number;
    y: number;
};

export default function Viewer({viewerItems}: {viewerItems: ItemData[]}) {
    const dropRef = useRef<HTMLDivElement>(null);
    return (
        <DndContext>
                    <DropArea ref={dropRef} >
                        {viewerItems.map((item) => (
                            <UndraggableItem
                                key={item.id}
                                id={`${item.id}viewer`}
                                type={item.type}
                                x={item.x}
                                y={item.y}
                            />
                        ))}
                    </DropArea>
        </DndContext>
    );
}





