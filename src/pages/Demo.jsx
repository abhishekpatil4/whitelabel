import DemoApp from "../components/DemoApp";
import DemoAppRequest from "../components/DemoAppRequest";
import twitterLogo from "../assets/appLogos/twitter-logo.jpg";
import githubLogo from "../assets/appLogos/github-logo.jpg";
import { createNewTweet } from "../utils/composio_utils";
import LoginAlert from "../components/LoginAlert";
import { useState } from "react";
import { signUpWithGoogle } from "../utils/firebase_utils";

const Demo = ({ user }) => {
    const [open, setOpen] = useState(false);
    const initiateLogin = async () => {
        try {
            await signUpWithGoogle();
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    };
    return <div className="h-screen">
        <LoginAlert open={open} setOpen={setOpen} action={initiateLogin} />
        <div className="flex flex-row gap-8 items-center justify-center mt-32">
            <DemoApp setOpen={setOpen} user={user} appName="TWITTER" logo={twitterLogo} title="Create Simple Tweet App" description="Uses Twitter Tool to create a tweet from connected account" action={createNewTweet} />
            <DemoApp setOpen={setOpen} user={user} appName="GITHUB" logo={githubLogo} title="Star a repo on Github" description="Uses Github Tool to star a repo from connected account" action={createNewTweet} />
            <DemoAppRequest user={user} />
        </div>
    </div>
}

export default Demo