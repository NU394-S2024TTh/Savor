/* eslint-disable @typescript-eslint/no-explicit-any */
import "../themes/styles.css";

//import { HomeIcon, PersonIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { HomeIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import * as Popover from "@radix-ui/react-popover";
import React, { ReactElement, useEffect, useState } from "react";

import Fridge from "../fridge/Fridge";
// Import other components for the 'profile' and 'upload' pages
//import Profile from '../profile/Profile';
import UploadPage from "../uploadpage/UploadPage";

type TabName = "fridge" | "profile" | "upload" | "additem";

const tabComponents: Record<TabName, ReactElement> = {
	// obviously change this once we have upload and profile components
	fridge: <Fridge />,
	profile: <Fridge />,
	upload: <UploadPage />, // TODO: add another item for adding manual items
	additem: <UploadPage />
};

function Homepage() {
	const [activeTab, setActiveTab] = useState<TabName>("fridge");
	const [updateTime, setUpdateTime] = useState<Date>(new Date());

	useEffect(() => {
		const handleSessionStorageChange = (event: Event) => {
			const customEvent = event as CustomEvent<any>;
			if (customEvent.detail.key === "rows") {
				// Set updateTime to the current date and time, which triggers a re-render
				setUpdateTime(new Date());
				console.log("HEERREEEE");

				// do this b/c reloading helps...
				window.location.reload();
			}
		};

		// Use the correct event name, JavaScript is case-sensitive
		window.addEventListener("SessionStorageChange", handleSessionStorageChange);
	}, []);
	const handleTabChange = (tabName: TabName) => {
		setActiveTab(tabName);
	};

	return (
		<div className="flex h-screen flex-col">
			<div className="">
				{React.cloneElement(tabComponents[activeTab], { key: updateTime.toISOString() })}
			</div>
			<div className="md:px-30 md-justify-center fixed bottom-0 flex w-full grow flex-row items-center justify-between  bg-[#faf9f6] px-12">
				<TabItem
					IconName={HomeIcon}
					active={activeTab === "fridge"}
					onClick={() => handleTabChange("fridge")}
				/>
				<UploadTabItem
					IconName={PlusCircleIcon}
					active={activeTab === "upload"}
					onClick={() => handleTabChange("fridge")}
					onUploadClick={() => handleTabChange("upload")}
				/>{" "}
				<TabItem
					IconName={UserIcon}
					active={activeTab === "profile"}
					onClick={() => handleTabChange("profile")}
				/>
			</div>
		</div>
	);
}

// Define prop types for TabItem using TypeScript interface
interface TabItemProps {
	IconName: React.ElementType;
	active: boolean;
	onClick: () => void;
}

function TabItem({ IconName, active, onClick }: TabItemProps) {
	const iconClass = active ? "stroke-green-500 min-h-8 min-w-8" : "stroke-gray-500 min-h-8 min-w-8";
	return (
		<button onClick={onClick}>
			<IconName className={iconClass} />
		</button>
	);
}

function UploadTabItem({
	IconName,
	active,
	onClick,
	onUploadClick
}: TabItemProps & { onUploadClick: () => void }) {
	const iconClass = active ? "stroke-green-500 min-h-8 min-w-8" : "stroke-gray-500 min-h-8 min-w-8";
	const buttonClass = "Button small green my-1";

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button onClick={onClick}>
					<IconName className={iconClass} />
				</button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content>
					<div className="AccordionRoot my-2 flex flex-col items-center py-2">
						{/* Using onUploadClick to change tab */}
						<button className={buttonClass} onClick={onUploadClick}>
							Upload Receipt
						</button>
						<button className={buttonClass}>Add Individual Item</button>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export default Homepage;
