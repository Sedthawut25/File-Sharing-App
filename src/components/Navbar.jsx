import { useContext, useEffect, useState } from "react";
import { Menu, X, Share2} from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import Sidemenu from "./Sidemenu";
import CreditsDisplay from "./CreditsDisplay";
import { UserCreditsContext } from "../context/UserCreditsContext";

const Navbar = ({activeMenu}) => {
    const[openSideMenu, SetOpenSidemenu] = useState(false);
    const{credits, fetchUserCredits} = useContext(UserCreditsContext);

    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);

    return (
        <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/* Left side - menu button and title */}
            <div className="flex items-center gap-5">
                <button 
                    onClick={() => SetOpenSidemenu(!openSideMenu)}
                    className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors">
                    {openSideMenu ? (
                        <X className="text-2xl"/>
                    ): (
                        <Menu className="text-2xl"/>
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <Share2 className="text-red-600" />
                    <span className="text-lg font-medium text-black truncate">
                        Cloud Share
                    </span>
                </div>
            </div>

            {/* Right side - vredits and user button */}
            <SignedIn>
                <div className="flex items-center gap-4">
                    <Link to="/subscription">
                        <CreditsDisplay credits={credits} />
                    </Link>
                    <div className="relative">
                        <UserButton />
                    </div>
                </div>
            </SignedIn>

            {/* Moblie side menu */}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20">
                    {/* Side menu bar */}
                    <Sidemenu activeMenu={activeMenu}/>
                </div>
            )}
        </div>
    )
}

export default Navbar;