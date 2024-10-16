import DemoApp from "../components/DemoApp";
import DemoAppRequest from "../components/DemoAppRequest";
import twitterLogo from "../assets/appLogos/twitter-logo.jpg";
import githubLogo from "../assets/appLogos/github-logo.jpg";
import { createNewTweet } from "../utils/composio_utils";

const Demo = ({ user }) => {
    return <div className="h-screen">
        <div className="flex flex-row gap-8 items-center justify-center mt-32">
            <DemoApp user={user} appName="TWITTER" logo={twitterLogo} title="Create Simple Tweet App" description="Uses Twitter Tool to create a tweet from connected account" action={createNewTweet}/>
            <DemoApp user={user} appName="GITHUB" logo={githubLogo} title="Star a repo on Github" description="Uses Github Tool to star a repo from connected account" />
            <DemoAppRequest user={user}/>
        </div>
    </div>
}

export default Demo