// ss kori
import { useState, useEffect } from "react";
import 'rsuite/Loader/styles/index.css';
import { Loader } from 'rsuite';
import { linkAccount, checkConnectionStatus } from "../utils/composio_utils";

const DemoApp = ({ logo, title, description, user, appName, action, setOpen }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [actionExecuting, setActionExecuting] = useState(false);

    useEffect(() => {
        if (user) {
            const checkConnectionStatusHelper = async () => {
                try {
                    setConnecting(true);
                    const authenticated = await checkConnectionStatus(appName, setIsConnected, user.email.split("@")[0]);
                    if (authenticated === "yes") {
                        setIsConnected(true);
                    }
                } catch (error) {
                    alert(error.message);
                } finally {
                    setConnecting(false);
                }
            }
            checkConnectionStatusHelper();
        }
    }, [user]);

    const handleConnect = async () => {
        if (user) {
            try {
                setConnecting(true);
                let url = await linkAccount(user.email.split("@")[0], appName);
                window.open(url, "_blank");
            } catch (error) {
                alert(error.message);
            } finally {
                setConnecting(false);
            }
        } else {
            setOpen(true);
        }
    };

    const handleAction = async () => {
        if (user) {
            try {
                setActionExecuting(true);
                await action(user.email.split("@")[0], appName);
            } catch (error) {
                alert(error.message);
            } finally {
                setActionExecuting(false);
            }
        } else {
            setOpen(true);
        }
    };

    return (
        <div className="flex flex-col gap-8 border border-gray-300 rounded-lg p-8 w-[22rem] h-[21rem]">
            <div>
                <img src={logo} alt="App Logo" className="w-24 mx-auto" />
            </div>
            <div className="text-center">
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="mx-auto w-full">
                {!isConnected ? (
                    <button
                        id="generate-retweet-quotes-for-existing-tweet-button"
                        type="button"
                        className="focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                        onClick={handleConnect}
                    >
                        {connecting ? <Loader speed="slow" size="sm" /> : "Connect"}
                    </button>
                ) : (
                    <button
                        id="generate-retweet-quotes-for-existing-tweet-button"
                        type="button"
                        className="focus:outline-none text-white w-full bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                        onClick={handleAction}
                    >
                        {actionExecuting ? <Loader speed="slow" size="sm" /> : "Perform Action"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default DemoApp;