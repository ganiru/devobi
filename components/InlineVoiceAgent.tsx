// src/components/InlineVoiceAgent.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Vapi from "@vapi-ai/web";
import "./InlineVoiceAgent.css";

const publicKey = process.env.VAPI_PUBLIC_KEY || "";

interface InlineVoiceAgentProps {
  /** Vapi assistant ID. Supplied by the embedding component so the agent
   *  can be switched per page/section. */
  assistantId: string;
  /** Small eyebrow label above the title. */
  eyebrow?: string;
  /** Main heading / title of the widget. */
  title?: string;
  /** Icon displayed in the avatar circle. Pass a lucide icon or any node. */
  icon?: ReactNode;
}

export default function InlineVoiceAgent({
  assistantId,
  eyebrow = "Voice assistant",
  title = "How can I help?",
  icon,
}: InlineVoiceAgentProps) {
  const vapiRef = useRef<Vapi | null>(null);
  // Tracks whether *we* started the call. Guards against late `call-start`
  // ("listening") app messages from the assistant arriving after stop(),
  // which would otherwise flip the UI back to an active state.
  const startedRef = useRef(false);

  const [status, setStatus] = useState<
    "idle" | "connecting" | "listening" | "speaking"
  >("idle");

  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      // Ignore "listening" app-message signals unless we actually started a
      // call. After stop() a stale/queued message must not revive the UI.
      if (!startedRef.current) return;
      setStatus("listening");
      setError("");
    });

    vapi.on("call-end", () => {
      startedRef.current = false;
      setStatus("idle");
      setTranscript("");
    });

    vapi.on("speech-start", () => {
      if (!startedRef.current) return;
      setStatus("speaking");
    });

    vapi.on("speech-end", () => {
      if (!startedRef.current) return;
      setStatus("listening");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        setTranscript(`${message.role}: ${message.transcript}`);
      }
    });

    vapi.on("error", (err) => {
      console.error("Vapi error:", err);
      startedRef.current = false;
      setError("Unable to connect to the voice agent.");
      setStatus("idle");
    });

    return () => {
      startedRef.current = false;
      vapi.stop();
    };
  }, []);

  async function startCall() {
    try {
      startedRef.current = true;
      setStatus("connecting");
      setError("");
      // roomDeleteOnUserLeaveEnabled: true destroys the Vapi room when the
      // user leaves, so the assistant cannot keep the call alive / reconnect.
      await vapiRef.current?.start(assistantId, {}, undefined, undefined, undefined, {
        roomDeleteOnUserLeaveEnabled: true,
      });
    } catch (err) {
      console.error(err);
      startedRef.current = false;
      setStatus("idle");
      setError("Could not start the conversation.");
    }
  }

  function endCall() {
    startedRef.current = false;
    setStatus("idle");
    vapiRef.current?.stop();
  }

  const callActive = status !== "idle";

  return (
    <section className="voice-agent">
      <div
        className={`voice-agent__avatar ${
          callActive ? "voice-agent__avatar--active" : ""
        }`}
      >
        {icon ?? "AI"}
      </div>

      <div className="voice-agent__content">
        <p className="voice-agent__eyebrow">{eyebrow} voice agent</p>
        {/* <h2>{title}</h2> */}

        <p className="voice-agent__status" aria-live="polite">
          {status === "idle" && "Ready to talk"}
          {status === "connecting" && "Connecting…"}
          {status === "listening" && "Listening…"}
          {status === "speaking" && "Conversation active"}
        </p>

        {transcript && (
          <div className="voice-agent__transcript">{transcript}</div>
        )}

        {error && <p className="voice-agent__error">{error}</p>}

        <button
          type="button"
          className={callActive ? "voice-agent__end" : "voice-agent__start"}
          onClick={callActive ? endCall : startCall}
          disabled={status === "connecting"}
        >
          {status === "connecting"
            ? "Connecting…"
            : callActive
              ? "End conversation"
              : "Start conversation"}
        </button>
      </div>
    </section>
  );
}