import { useState, useEffect } from "react";
import { API_BASE_URL } from "../environment";

interface BackendStatusProps {
  showAlways?: boolean;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ showAlways = false }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showMessage, setShowMessage] = useState(true);

  const checkBackendConnection = async () => {
    setIsChecking(true);
    try {
      // Try to reach the backend health endpoint or auth endpoint
      const response = await fetch(`${API_BASE_URL}/actuator/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        // Try another endpoint if health check fails
        const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "OPTIONS",
        });
        setIsConnected(authResponse.ok || authResponse.status === 405);
      }
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (isConnected === true && !showAlways) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, showAlways]);

  // Don't show anything if connected and message is hidden
  if (!showMessage && isConnected && !showAlways) {
    return null;
  }

  // Don't show while initially checking
  if (isChecking && isConnected === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      
      {isConnected === true && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          />
          <span>✓ Backend Connected</span>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>
            ({API_BASE_URL})
          </span>
          <button
            onClick={() => setShowMessage(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "0 0 0 10px",
              fontSize: "18px",
              opacity: 0.7,
            }}
          >
            ×
          </button>
        </div>
      )}

      {isConnected === false && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            backgroundColor: "#ef4444",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              borderRadius: "50%",
            }}
          />
          <div>
            <div>✗ Backend Not Connected</div>
            <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>
              Make sure backend is running at {API_BASE_URL}
            </div>
          </div>
          <button
            onClick={checkBackendConnection}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              marginLeft: "10px",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {isChecking && isConnected !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(107, 114, 128, 0.4)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              animation: "pulse 1s infinite",
            }}
          />
          <span>Checking connection...</span>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;

