import { cn } from "@/lib/utils";
import { Bell, User2 } from "lucide-react";
import MaxWidthWrapper from "../components/MaxWidthWrapper";

const Navbar = () => {
  return (
    <nav className={cn(" py-4 bg-white shadow-sm border-b")}>
      <MaxWidthWrapper className="flex justify-between items-center">
        <>
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            <span className="text-gray-500">Better</span>ToDo
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <Bell className="w-6 h-6" />
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-blue-50">
              <User2 />
            </div>
          </div>
        </>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
