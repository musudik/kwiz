/**
 * KWIZ Hook - useConnection
 * Custom hook for managing WebSocket connection
 */

import { useCallback, useEffect, useState } from 'react';
import { getWebSocketUrl } from '../config';
import { socketService } from '../services';
import { useAppStore } from '../store';

interface UseConnectionOptions {
    autoConnect?: boolean;
    serverUrl?: string;
}

interface UseConnectionReturn {
    isConnected: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
    error: string | null;
    connect: (url?: string) => Promise<void>;
    disconnect: () => void;
}

// Use configured server URL
const DEFAULT_SERVER_URL = getWebSocketUrl();

export function useConnection(options: UseConnectionOptions = {}): UseConnectionReturn {
    const {
        autoConnect = false,
        serverUrl = DEFAULT_SERVER_URL,
    } = options;

    const {
        isConnected,
        connectionStatus,
        error,
        setConnectionStatus,
        setError,
        setServerUrl,
    } = useAppStore();

    const [connecting, setConnecting] = useState(false);

    const connect = useCallback(async (url?: string) => {
        const targetUrl = url || serverUrl;

        if (connecting || socketService.isConnected()) {
            return;
        }

        setConnecting(true);
        setError(null);
        setServerUrl(targetUrl);

        try {
            await socketService.connect(targetUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to connect to server');
        } finally {
            setConnecting(false);
        }
    }, [serverUrl, connecting, setError, setServerUrl]);

    const disconnect = useCallback(() => {
        socketService.disconnect();
        setError(null);
    }, [setError]);

    // Auto-connect on mount if enabled
    useEffect(() => {
        if (autoConnect && !isConnected && !connecting) {
            connect();
        }

        return () => {
            // Don't disconnect on unmount to maintain connection across screens
        };
    }, [autoConnect, isConnected, connecting, connect]);

    return {
        isConnected,
        connectionStatus,
        error,
        connect,
        disconnect,
    };
}

export default useConnection;
