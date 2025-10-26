// types/TabComponent.ts
export interface TabItem {
  key: string;
title: string;
  content: React.ReactNode;
  disabled?: boolean;
}
