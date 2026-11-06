"use client";

/**
 * Contact as an interactive shell. Enter moves to the next prompt; Enter on
 * the message (or `$ send`) submits; Shift+Enter adds a newline. Validation
 * errors print as red stderr lines; success makes the Core's antenna pulse.
 */
import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contactSchema";
import { sendContact } from "@/app/actions/contact";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";
import { scrollState, toast } from "@/hooks/useScrollStore";
import { playSound } from "@/lib/sound";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

type Log = { kind: "out" | "err" | "ok" | "cmd"; text: string };

export function Contact() {
  const [log, setLog] = useState<Log[]>([]);
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onValid = (data: ContactInput) => {
    playSound("tick");
    setLog([
      { kind: "cmd", text: "./contact.sh --send" },
      { kind: "out", text: "> POST /actions/contact … connecting to mail relay" },
    ]);
    startTransition(async () => {
      const res = await sendContact(data);
      if (res.ok) {
        setLog((l) => [
          ...l,
          { kind: "ok", text: copy.contact.success },
          { kind: "out", text: `> I'll reply to ${data.email} soon.` },
        ]);
        scrollState.pulse = 1;
        setSent(true);
        reset();
      } else {
        setLog((l) => [...l, { kind: "err", text: `stderr: ${res.error}` }]);
      }
    });
  };
  const onInvalid = () => {
    playSound("tick");
    setLog([
      { kind: "cmd", text: "./contact.sh --send" },
      { kind: "err", text: "stderr: validation failed — fix the fields marked above" },
    ]);
  };
  const submit = handleSubmit(onValid, onInvalid);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast(`${profile.email} copied`);
    } catch {
      toast(profile.email);
    }
  };

  const field =
    "w-full bg-transparent text-text caret-primary outline-none placeholder:text-faint/60";
  const row = "flex gap-3 border-b border-line/60 py-3 focus-within:border-primary/60";

  return (
    <section
      id="contact"
      data-scene="8"
      aria-labelledby="contact-title"
      className="relative min-h-screen px-[5vw] pt-24 pb-24 lg:pl-[calc(5vw+60px)] xl:pr-[calc(5vw+56px)]"
    >
      <SectionHeading
        id="contact-title"
        eyebrow={copy.contact.eyebrow}
        parts={copy.contact.title}
      />
      <p className="t-body mt-8 max-w-[52ch]">{copy.contact.lead}</p>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="glass overflow-hidden rounded-[8px]">
            <div className="border-line text-faint flex items-center gap-3 border-b px-4 py-2.5 font-mono text-xs">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
              </span>
              visitor@afnan: ~/contact.sh
            </div>
            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              className="px-5 pt-2 pb-5 font-mono text-[14px]"
            >
              <p className="text-faint py-2">
                # fill the prompts — Enter to continue, Shift+Enter for a newline
              </p>

              <div className={row}>
                <label htmlFor="c-name" className="text-accent shrink-0">
                  $ name:
                </label>
                <input
                  id="c-name"
                  autoComplete="name"
                  placeholder="_"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "c-name-err" : undefined}
                  {...register("name")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setFocus("email");
                    }
                  }}
                  className={field}
                />
              </div>
              {errors.name && (
                <p id="c-name-err" className="text-danger py-1 text-[13px]">
                  stderr: {errors.name.message}
                </p>
              )}

              <div className={row}>
                <label htmlFor="c-email" className="text-accent shrink-0">
                  $ email:
                </label>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  placeholder="_"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "c-email-err" : undefined}
                  {...register("email")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setFocus("message");
                    }
                  }}
                  className={field}
                />
              </div>
              {errors.email && (
                <p id="c-email-err" className="text-danger py-1 text-[13px]">
                  stderr: {errors.email.message}
                </p>
              )}

              <div className={cn(row, "items-start")}>
                <label htmlFor="c-message" className="text-accent shrink-0">
                  $ message:
                </label>
                <textarea
                  id="c-message"
                  rows={4}
                  placeholder="_"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "c-message-err" : undefined}
                  {...register("message")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      formRef.current?.requestSubmit();
                    }
                  }}
                  className={cn(field, "resize-none")}
                />
              </div>
              {errors.message && (
                <p id="c-message-err" className="text-danger py-1 text-[13px]">
                  stderr: {errors.message.message}
                </p>
              )}

              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
                {...register("company")}
              />

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={pending}
                    className="bg-primary text-bg hover:bg-text inline-flex items-center gap-2 rounded-[8px] px-5 py-3 transition-colors disabled:opacity-60"
                  >
                    <span data-magnetic-inner>
                      {pending ? "$ sending…" : sent ? "$ send --again" : "$ send"}
                    </span>
                  </button>
                </Magnetic>
                <span className="text-faint text-xs">or press Enter in the message</span>
              </div>

              <div aria-live="polite" className="mt-5 space-y-1 text-[13px]">
                {log.map((l, i) => (
                  <p
                    key={i}
                    className={cn(
                      l.kind === "err" && "text-danger",
                      l.kind === "ok" && "text-accent",
                      l.kind === "out" && "text-muted",
                      l.kind === "cmd" && "text-text",
                    )}
                  >
                    {l.kind === "cmd" && <span className="text-accent">$ </span>}
                    {l.text}
                  </p>
                ))}
              </div>
            </form>
          </div>
        </div>

        <aside
          className="space-y-8 font-mono text-sm lg:col-span-4 lg:col-start-9 lg:pt-4"
          aria-label="Other ways to reach me"
        >
          <div>
            <p className="t-label mb-3">email</p>
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="copy"
              className="group text-text hover:text-primary flex items-center gap-3 text-left text-[clamp(1rem,1.6vw,1.4rem)] break-all transition-colors"
            >
              {profile.email}
              <Icon
                name="copy"
                size={16}
                className="text-faint group-hover:text-primary shrink-0"
              />
            </button>
          </div>
          <div>
            <p className="t-label mb-3">phone</p>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="text-text hover:text-primary"
            >
              {profile.phone}
            </a>
          </div>
          <div>
            <p className="t-label mb-3">elsewhere</p>
            <ul className="space-y-2">
              {[
                { href: profile.links.github, label: "github", icon: "github" },
                { href: profile.links.linkedin, label: "linkedin", icon: "linkedin" },
                { href: profile.links.twitter, label: "x / twitter", icon: "x" },
                { href: profile.links.instagram, label: "instagram", icon: "instagram" },
                { href: profile.links.oldPortfolio, label: "portfolio v1", icon: "globe" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group text-muted hover:text-text inline-flex items-center gap-3 transition-colors"
                  >
                    <Icon name={l.icon} size={16} />
                    {l.label}
                    <span className="text-faint transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={profile.resume}
            download
            className="hairline text-text hover:border-primary hover:text-primary inline-flex items-center gap-3 rounded-[8px] px-4 py-3"
          >
            <Icon name="download" size={16} /> $ download resume.pdf
          </a>
        </aside>
      </div>
    </section>
  );
}
