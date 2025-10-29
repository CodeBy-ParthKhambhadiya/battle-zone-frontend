"use client";

import OrganizerHeader from "@/components/organizer/OrganizerHeader";
import OrganizerFooter from "@/components/organizer/OrganizerFooter";
import OrganizerIcons from "@/components/organizer/OrganizerIcons";

export default function OrganizerLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-black">
            <OrganizerHeader />
            <OrganizerIcons />

            <div className="flex-grow overflow-y-auto scrollbar-custom">
                {children}
            </div>
            {/* <OrganizerFooter /> */}
        </div>
    );
}
