import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Particles from "../../3d/Particles";

export const CONTACT_EMAIL = "pablo.raviola@gmail.com";

// Optional form backend (e.g. Formspree: https://formspree.io/f/<form-id>).
// When it is not configured the form falls back to opening the visitor's
// email client with the message pre-filled.
const FORM_ENDPOINT = process.env.REACT_APP_CONTACT_FORM_ENDPOINT || "";

const STATUS = {
  IDLE: "idle",
  SENDING: "sending",
  SENT: "sent",
  MAILTO: "mailto",
  ERROR: "error",
};

const buildMailto = ({ name, email, message }) => {
  const subject = `Portfolio contact from ${name || "your website"}`;
  const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1.5 text-left">
    <span
      className="text-xs uppercase tracking-[0.2em] text-gray-400"
      style={{ fontFamily: "Fareno, system-ui, sans-serif" }}
    >
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors duration-300 focus:border-[#3b82f6] focus:bg-white/10";

const ContactSection = ({ onScrollToPrev, isActive = true }) => {
  const containerRef = useRef(null);
  const scrollBufferRef = useRef(0);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(STATUS.IDLE);
  const [copied, setCopied] = useState(false);

  // Section navigation: scrolling up leaves the section, scrolling inside the
  // message box scrolls the textarea instead
  useEffect(() => {
    if (!isActive) {
      scrollBufferRef.current = 0;
      return;
    }

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target;
      if (
        target instanceof HTMLTextAreaElement &&
        target.scrollHeight > target.clientHeight
      ) {
        target.scrollTop += e.deltaY;
        return;
      }

      if (e.deltaY < 0) {
        scrollBufferRef.current += Math.abs(e.deltaY);
        if (scrollBufferRef.current > 150) {
          scrollBufferRef.current = 0;
          if (onScrollToPrev) onScrollToPrev();
        }
      } else {
        scrollBufferRef.current = 0;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, [isActive, onScrollToPrev]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status === STATUS.SENT || status === STATUS.ERROR) {
      setStatus(STATUS.IDLE);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === STATUS.SENDING) return;

    if (!FORM_ENDPOINT) {
      window.location.href = buildMailto(values);
      setStatus(STATUS.MAILTO);
      return;
    }

    setStatus(STATUS.SENDING);
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          _replyto: values.email,
          _subject: `Portfolio contact from ${values.name}`,
        }),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      setStatus(STATUS.SENT);
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus(STATUS.ERROR);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const feedback = {
    [STATUS.SENT]: {
      text: "Message sent - thank you! I'll get back to you soon.",
      className: "text-emerald-400",
    },
    [STATUS.MAILTO]: {
      text: "Your email client should open with the message ready to send.",
      className: "text-sky-400",
    },
    [STATUS.ERROR]: {
      text: "Something went wrong sending the message.",
      className: "text-red-400",
    },
  }[status];

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at center, #0f1419 0%, #050810 40%, #000000 70%)",
      }}
    >
      {/* Particle backdrop */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Particles />
          <Particles position={[0, 0, -20]} />
        </Suspense>
      </Canvas>

      {/* Title */}
      <div className="absolute top-[6%] short:top-[3%] left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1200 200"
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          <defs>
            <filter
              id="contactGlow"
              x="-5%"
              y="-50%"
              width="110%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fontSize="150"
            fontWeight="100"
            letterSpacing="0.1em"
            fontFamily="Fareno, system-ui, sans-serif"
            filter="url(#contactGlow)"
            style={{ paintOrder: "stroke" }}
          >
            CONTACT ME
          </text>
        </svg>
      </div>

      {/* Card */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-[10vh] short:pt-[8vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl bg-[#0f1419] bg-opacity-50 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg shadow-white/10 p-6 xl:p-8 short:p-5 flex flex-col gap-4 short:gap-3"
          style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
        >
          <div className="flex flex-col gap-1 text-center">
            <h2
              className="text-2xl xl:text-3xl short:text-2xl font-extrabold italic text-white"
              style={{ fontFamily: "Fareno, system-ui, sans-serif" }}
            >
              Let's build something together
            </h2>
            <p className="text-sm text-gray-400">
              Have a project in mind or just want to say hi? Drop me a line.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 short:gap-2.5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Name">
                <input
                  className={inputClass}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={values.name}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Email">
                <input
                  className={inputClass}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={values.email}
                  onChange={handleChange}
                />
              </Field>
            </div>
            <Field label="Message">
              <textarea
                className={`${inputClass} resize-none h-36 short:h-28`}
                name="message"
                placeholder="Tell me about your project..."
                required
                minLength={10}
                value={values.message}
                onChange={handleChange}
              />
            </Field>

            <button
              type="submit"
              disabled={status === STATUS.SENDING}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 disabled:opacity-60 disabled:cursor-wait transition-all duration-300 px-5 py-3 font-bold text-white"
            >
              {status === STATUS.SENDING ? "Sending..." : "Send message"}
              <i
                className={
                  status === STATUS.SENDING
                    ? "fas fa-circle-notch fa-spin"
                    : "fas fa-paper-plane"
                }
              ></i>
            </button>

            <p
              className={`min-h-[1.25rem] text-center text-sm ${
                feedback ? feedback.className : "text-transparent"
              }`}
              role="status"
            >
              {feedback ? feedback.text : "\u00a0"}
              {status === STATUS.ERROR && (
                <>
                  {" "}
                  <a
                    className="underline text-sky-400"
                    href={buildMailto(values)}
                  >
                    Send it by email instead
                  </a>
                  .
                </>
              )}
            </p>
          </form>

          {/* Direct contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-white/10 pt-4 short:pt-3 text-sm text-gray-400">
            <span>Or reach me directly at</span>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white hover:text-sky-400 transition-colors duration-300"
              >
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                title="Copy email address"
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-300 hover:border-[#3b82f6] hover:text-white transition-colors duration-300"
              >
                {copied ? "Copied!" : <i className="far fa-copy"></i>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-20 text-center text-xs text-gray-600 pointer-events-none">
        © {new Date().getFullYear()} Pablo Raviola
      </div>
    </div>
  );
};

export default ContactSection;
