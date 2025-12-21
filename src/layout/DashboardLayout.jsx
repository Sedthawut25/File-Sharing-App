import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Sidemenu from "../components/Sidemenu";

const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useUser();
    return (
        <div>
            {/* Navabr component goes here */}
            <Navbar activeMenu={activeMenu}/>
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        {/* Sidemenu goes here */}
                        <Sidemenu activeMenu={activeMenu}/>
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            )

            }
        </div>
    )
}

export default DashboardLayout;