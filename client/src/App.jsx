import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socket = io("https://cute-ping-app.onrender.com");

export default function App() {
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    socket.on("joined", () => {
      setJoined(true);
      setError("");
    });

    socket.on("error", (msg) => {
      setError(msg);
    });

    socket.on("ping", () => {
      setShowVideo(true);
    });

    return () => {
      socket.off("joined");
      socket.off("error");
      socket.off("ping");
    };
  }, []);

  const handleJoin = () => {
    socket.emit("join", code);
  };

  const sendPing = () => {
    socket.emit("ping");
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-pink-50">
      {!joined ? (
        <>
          <h1 className="text-2xl font-bold">Enter Access Code</h1>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-64 my-2"
          />
          <Button onClick={handleJoin}>Join</Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-pink-600">Secret Room :)</h1>
          <Button onClick={sendPing} className="text-xl px-6 py-3 mt-4">
            🛎️ Ping!
          </Button>
        </>
      )}

      {showVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <p className="text-white text-xl mb-4 font-semibold animate-pulse">
            Quick break po, You need it!
          </p>
          <video
            src="/pingVideo.mp4"
            autoPlay
            loop
            className="max-w-md rounded-xl shadow-xl mb-4"
          />
          <Button onClick={() => setShowVideo(false)} variant="destructive">
            End Video
          </Button>
        </div>
      )}
    </div>
  );
}
