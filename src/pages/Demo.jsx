import DemoApp from "../components/DemoApp";
import DemoAppRequest from "../components/DemoAppRequest";
import twitterLogo from "../assets/appLogos/twitter-logo.jpg";
import githubLogo from "../assets/appLogos/github-logo.jpg";
import jiraLogo from "../assets/appLogos/jira-logo.jpg";
import clickupLogo from "../assets/appLogos/clickup-logo.jpg";
import { createNewTweet, starGithubRepo, createClickupSpace } from "../utils/composio_utils";
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
        } finally {
            setOpen(false);
        }
    };
    return <div className="h-screen">
        <LoginAlert open={open} setOpen={setOpen} action={initiateLogin} />
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-14 items-center justify-center 2xl:mx-36 xl:mx-24 md:mx-14 mt-32">
            <DemoApp actionDescription="This action will create a tweet saying 'Hey! I used @composiohq to create this tweet' from connected account." setOpen={setOpen} user={user} appName="TWITTER" logo={twitterLogo} title="Create Simple Tweet App" description="Uses Twitter Tool to create a tweet from connected account" action={createNewTweet} />
            <DemoApp actionDescription="This action will star the composioHQ/composio repository from connected account" setOpen={setOpen} user={user} appName="GITHUB" logo={githubLogo} title="Star a repo on Github" description="Uses Github Tool to star a repo from connected account" action={starGithubRepo} />
            <DemoApp actionDescription="This action will create a new space in Clickup from connected account" setOpen={setOpen} user={user} appName="CLICKUP" logo={clickupLogo} title="Create A New Space" description="Uses Clickup Tool to create a new space from connected account" action={createClickupSpace} logoRounded={true} inputRequired={true} inputValue="workspace id"/>
            {/* <DemoApp actionDescription="This action will create an issue in Jira from connected account." setOpen={setOpen} user={user} appName="JIRA" logo={jiraLogo} title="Create An Issue" description="Uses Jira Tool to create an issue from connected account" action={createNewTweet}/> */}
            <DemoAppRequest user={user} />
        </div>
    </div>
}

export default Demo