import LeftSidebar from "./LeftSidebar"
import MessageList from "../../components/MessageList"
import Chatbox from "../../components/Chatbox"

const Message = () => {
    return (
        <>
            <LeftSidebar />
            <Chatbox />
            <MessageList />
        </>
    )
}

export default Message