import React, { Component } from "react";
import useChatStore from "../src/store/useChatStore";
import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

/**
 * Local React Error Boundary Class Component.
 * Intercepts unhandled rendering runtime errors thrown by malformed message payloads
 * down the component tree, preventing a total application crash.
 */
class ChatLayoutErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the safe fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ChatLayoutErrorBoundary caught an uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Elegant DaisyUI Fallback UI when rendering errors crash the active feed
            return (
                <div className="h-full w-full flex flex-col items-center justify-center bg-base-300 p-6 text-center">
                    <div className="max-w-md bg-base-100 p-8 rounded-2xl shadow-xl border border-base-content/10">
                        <h2 className="text-xl font-bold text-error mb-2">Conversation Feed Unavailable</h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            An error occurred while displaying this chat layout. This is usually caused by a corrupted or unsupported message format payload.
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-sm btn-outline btn-error rounded-full"
                        >
                            Reload Interface
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * ChatPage Component Layout Shell.
 * Orchestrates the responsive dual-panel view between the sidebar and active windows.
 * Wrapped securely in a layout boundary to handle malformed message streams gracefully.
 *
 * @returns {React.JSX.Element}
 */
export default function ChatPage() {
    const { setSelectedUser, selectedUser } = useChatStore();
    const chatSelected = !!selectedUser;

    return (
        <ChatLayoutErrorBoundary>
            <div className="h-full flex overflow-hidden bg-base-200 relative">
                <Sidebar
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                    isMobileHidden={chatSelected}
                />
                <ChatWindow
                    selectedUser={selectedUser}
                    onBack={() => setSelectedUser(null)}
                    isMobileHidden={!chatSelected}
                />
            </div>
        </ChatLayoutErrorBoundary>
    );
}