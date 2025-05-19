import './CanvasArea.css';
import UndraggableItem from './UndraggableItem/UndraggableItem';

type ItemData = {
    id: string;
    type: any;
    x: number;
    y: number;
    text?: string;
    src?: string
};

export default function Viewer({viewerItems}: {viewerItems: ItemData[]}) {
    return (
        <div className="view-area">
            {viewerItems.map((item) => (
                <UndraggableItem
                    key={item.id}
                    id={`${item.id}viewer`}
                    type={item.type}
                    x={item.x}
                    y={item.y}
                    data={item.src ? { src: item.src } : { text: item.text }}
                />
            ))}
        </div>
    );
}





