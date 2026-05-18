import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  return (
    <div className="h-full">
      {/* Cột 1: Server List - 72px */}
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      {/* Phần còn lại */}
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
