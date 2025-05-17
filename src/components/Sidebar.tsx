// Sidebar.tsx
import { SidebarProps } from '../types/types';
import ToolboxItem from './Toolboxitem';

export default function Sidebar({ items, cleanMenu }: SidebarProps) {
  return (
    <div
      onMouseOver={cleanMenu}
      style={{
        width: '200px',
        padding: '12px',
        backgroundColor: '#f4f4f4',
        borderRight: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {items.map((item) => (
        <ToolboxItem key={item.id} id={item.id} label={item.label}/>
      ))}
    </div>
  );
}
