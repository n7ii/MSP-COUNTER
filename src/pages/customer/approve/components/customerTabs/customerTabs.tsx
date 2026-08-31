import { Tabs, Tab } from "@heroui/react";
import * as React from "react";

interface TabItem {
    key: string;
    title: React.ReactNode;
    content: React.ReactNode;
}

interface TabsComponentProps {
    tabs: TabItem[];
    variants: "solid" | "underlined" | "bordered" | "light" | undefined;

}

const CustomerTabs: React.FC<TabsComponentProps> = ({ tabs, variants }) => {
    return (
        <div className="flex w-full flex-col">
            <Tabs
                aria-label="Options"
                color="primary"
                className="bg-white shadow-sm px-4 py-2 rounded-full dark:bg-[#18181B] dark:text-white dark:border-gray-600"
                variant={variants}
            >
                {tabs?.map((tab) => (
                    <Tab key={tab.key} title={tab.title}>
                        <div className="px-0">{tab.content}</div>
                    </Tab>
                ))}
            </Tabs>

        </div>
    );
};

export default CustomerTabs;
