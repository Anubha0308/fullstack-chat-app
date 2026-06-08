import { useRef, useCallback, useEffect } from "react";
import { getSocket } from "../lib/socket";

export default function useTypingIndicator(receiverId) {
    const timeoutRef = useRef(null);
    const lastEmitRef = useRef(0);

    const emitTyping = useCallback(() => {
        const socket = getSocket();

        if (!socket || !receiverId) return;

        const now = Date.now();

        // throttle typing event emission
        if (now - lastEmitRef.current > 1000) {
            socket.emit("typing", { receiverId });
            lastEmitRef.current = now;
        }

        // debounce stop typing event
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { receiverId });
        }, 2000);

    }, [receiverId]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { emitTyping };
}