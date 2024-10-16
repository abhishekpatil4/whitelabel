import AppRequestForm from "../components/AppRequestForm";
import { useState } from "react";
const DemoAppRequest = ({ user }) => {
    const [open, setOpen] = useState(false);
    return (
        <div onClick={() => setOpen(true)} className="flex flex-col gap-8 border-dashed border-2 border-gray-300 rounded-lg p-8 w-[22rem] h-[21rem] cursor-pointer hover:border-gray-400">
            <p className="m-auto text-gray-500">Request a demo for your app</p>
            <AppRequestForm user={user} open={open} setOpen={setOpen} />
        </div>
    );
}

export default DemoAppRequest;