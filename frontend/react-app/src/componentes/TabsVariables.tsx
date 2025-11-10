import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import type { TabItem } from '../types/ui/TabComponent';


interface Props {
  tabs: TabItem[];
  defaultKey?: string;
  className?: string;
}

export default function TabComponent({ tabs, defaultKey, className }: Props) {
  return (
    <Tabs defaultActiveKey={defaultKey} className={className}>
      {tabs.map(({ key, title, content, disabled }) => (
        <Tab key={key} eventKey={key} title={title} disabled={disabled}>
          {content}
        </Tab>
      ))}
    </Tabs>
  );
}