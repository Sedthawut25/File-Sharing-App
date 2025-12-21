import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFile from "./pages/Myfile";
import Subscription from "./pages/Subscription";
import Transactions from "./pages/Transactions";
import PublicFileView from "./pages/PublicFileView";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { UserCreditsProvider } from "./context/UserCreditsContext";

const App = () => {
    return(
        <UserCreditsProvider>
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={
                    <>
                        <SignedIn><Dashboard /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/upload" element={
                    <>
                        <SignedIn><Upload /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/my-files" element={
                    <>
                        <SignedIn><MyFile /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/subscription" element={
                    <>
                        <SignedIn><Subscription /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/transactions" element={
                    <>
                        <SignedIn><Transactions /></SignedIn>
                        <SignedOut><RedirectToSignIn /></SignedOut>
                    </>
                } />
                <Route path="/file/:fileId" element={<PublicFileView />} />
                <Route path="/*" element={<RedirectToSignIn />}></Route>
            </Routes>
        </BrowserRouter>
        </UserCreditsProvider>
    )
}

export default App;