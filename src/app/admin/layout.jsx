"use client";

import AdminHeader from "@/components/admin/AdminHeader";
// import AdminFooter from "@/components/admin/AdminFooter";
import AdminIcons from "@/components/admin/AdminIcons";

export default function OrganizerLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-black">
            <AdminHeader />
            <AdminIcons />

            <div className="flex-grow overflow-y-auto scrollbar-custom">
                {children}
            </div>
            {/* <AdminFooter /> */}
        </div>
    );
}
