import { auth } from "../config/firebase";
import axios from "axios";

const initiateTwitterConnectionAndConnectAdmin = async (user, setTwitterAccountLoading = null) => {
    try {
        if (setTwitterAccountLoading) setTwitterAccountLoading(true);
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            username: user,
            redirectUrl: window.location.href
        };
        const newIntegrationURL = import.meta.env.VITE_BACKEND_URL + "/newintegration"
        const response = await axios.post(newIntegrationURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            alert(response.data.message);
        } else if (response.data.authenticated === "no") {
            if (!setTwitterAccountLoading) {
                return response.data.url;
            }
            window.open(response.data.url, '_blank');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    } finally {
        if (setTwitterAccountLoading) setTwitterAccountLoading(false);
    }
}

const linkAccount = async (user, appName) => {
    try {
        const idToken = await auth.currentUser.getIdToken(true);
        const data = {
            newUserId: user,
            redirectUrl: window.location.href,
            appName: appName
        };
        console.log("\n\nData from link account :: ", data)
        const newEntityURL = import.meta.env.VITE_BACKEND_URL + "/newentity"
        const response = await axios.post(newEntityURL, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.authenticated === "yes") {
            alert(response.data.message);
        } else if (response.data.authenticated === "no") {
            return response.data.url;
        }
    } catch (error) {
        console.error("Full error object:", error);
        console.log("\n\nError :: ", error)
    }
}

const checkConnectionStatus = async (appName, setIsConnected, username) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/checkconnection`,
            { username: username, appType: appName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.data.authenticated === "yes") {
            setIsConnected("Connected");
        }
        return response.data.authenticated;
    } catch (error) {
        console.error("Full error object:", error);
        console.log("\n\nError :: ", error)
    }
}

const createNewTweet = async (entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/createtweet`,
            { entity_id: entityId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("Error creating new tweet:", error);
        throw error;
    }
};

const starGithubRepo = async (entityId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/stargithubrepo`,
            { entity_id: entityId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data.result;
    } catch (error) {
        console.error("Error starring GitHub repo:", error);
        throw error;
    }
};


export { checkConnectionStatus, linkAccount, initiateTwitterConnectionAndConnectAdmin, createNewTweet, starGithubRepo };
