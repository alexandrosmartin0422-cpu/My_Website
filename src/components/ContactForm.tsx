"use client";

import { useState } from "react";
import { site } from "@/lib/site";

// Available recipients for the contact form. The `to` value must match one of
// these so a user can't inject an arbitrary address via the URL/state.
const recipients = [
  { value: site.email, label: "General enquiry" },
  { value: site.emailSecondary, label: "Project / collaboration" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recipient, setRecipient] = useState(recipients[0].value);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Only allow a known recipient; fall back to the primary email otherwise.
    const to =
      recipients.find((r) => r.value === recipient)?.value ?? site.email;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, recipient: to, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message.");
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setRecipient(recipients[0].value);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "w-full rounded-lg border border-rock-700 bg-rock-900 px-4 py-2.5 text-sm text-rock-100 placeholder-rock-500 outline-none transition duration-200 hover:border-rock-600 focus:border-cyber-400 focus:shadow-glow-cyber focus:bg-rock-900/80";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-rock-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-rock-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="recipient" className="mb-2 block text-sm text-rock-300">
          Send to
        </label>
        <select
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={field}
        >
          {recipients.map((r) => (
            <option key={r.value} value={r.value} className="bg-rock-900">
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-rock-300">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder="How can I help?"
        />
      </div>

      <button
        type="submit"
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "sent" && (
        <p className="text-sm text-ore-400" role="status">
          Thanks — your message has been sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {errorMsg}
        </p>
      )}
      {status !== "sent" && status !== "error" && (
        <p className="text-xs text-rock-500">
          Your message is sent directly — no email client required.
        </p>
      )}
    </form>
  );
}
