"use client";

/**
 * Otunity Labs Portal — Invisible hCaptcha
 *
 * Copiado y adaptado del patrón de JChat 3.0 (decisión D-38).
 * Envuelve `@hcaptcha/react-hcaptcha` en modo `invisible` y expone
 * un handle imperativo vía ref:
 *
 *     const captchaRef = useRef<InvisibleCaptchaHandle>(null);
 *     <InvisibleCaptcha ref={captchaRef} />
 *
 *     const captcha = (await captchaRef.current?.getToken()) ?? { status: "disabled" };
 *     if (captcha.status === "failed") { setError("..."); return; }
 *     const captchaToken = captcha.status === "ok" ? captcha.token : undefined;
 *
 * ── getToken() ──────────────────────────────────────────────────────────────
 * Devuelve el token y SIEMPRE resetea el widget después (token de UN SOLO USO).
 * Un submit fallido (contraseña incorrecta, etc.) ya quemó el token; el siguiente
 * intento pedirá uno nuevo.
 *
 * ── Kill-switch ─────────────────────────────────────────────────────────────
 * Si NEXT_PUBLIC_HCAPTCHA_SITEKEY falta o es "PENDIENTE_SITEKEY", el componente
 * no renderiza nada y getToken() devuelve `{ status: "disabled" }`.
 * Permite desarrollar sin la key real; el CAPTCHA de Supabase se ignora si está
 * global-OFF, así que enviar undefined es seguro en desarrollo.
 *
 * ── Gate de "ready" ─────────────────────────────────────────────────────────
 * El widget invisible carga su iframe de forma asíncrona. Ejecutar execute()
 * antes dispara un error espurio. Esperamos al onLoad (máx. 4 s, fail-open).
 */

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const PLACEHOLDER_SITEKEY = "PENDIENTE_SITEKEY";
const SITE_KEY = (process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? "").trim();

/** True cuando hay una sitekey real configurada. */
export const isCaptchaEnabled: boolean =
  SITE_KEY.length > 0 && SITE_KEY !== PLACEHOLDER_SITEKEY;

/**
 * Resultado de getToken() — discrimina los dos motivos por los que no hay token:
 *   · 'ok'       → reto superado; usa `token`.
 *   · 'disabled' → kill-switch activo; procede sin token.
 *   · 'failed'   → reto cancelado/expirado/erróneo; ABORTA el submit.
 */
export type CaptchaResult =
  | { status: "ok"; token: string }
  | { status: "disabled" }
  | { status: "failed" };

export type InvisibleCaptchaHandle = {
  /** Ejecuta el reto, devuelve un CaptchaResult y resetea el widget. */
  getToken: () => Promise<CaptchaResult>;
  /** Resetea el widget manualmente (getToken ya lo hace automáticamente). */
  reset: () => void;
};

const InvisibleCaptcha = forwardRef<InvisibleCaptchaHandle>(
  function InvisibleCaptcha(_props, ref) {
    const captchaRef = useRef<HCaptcha>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    // Gate de "ready": esperar al onLoad antes de execute().
    const readyRef = useRef(false);
    const readyWaitersRef = useRef<Array<() => void>>([]);

    const markReady = useCallback(() => {
      readyRef.current = true;
      const waiters = readyWaitersRef.current;
      readyWaitersRef.current = [];
      waiters.forEach((w) => w());
    }, []);

    const waitForReady = useCallback((timeoutMs = 4000): Promise<void> => {
      if (readyRef.current) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const t = setTimeout(resolve, timeoutMs); // fail-open
        readyWaitersRef.current.push(() => {
          clearTimeout(t);
          resolve();
        });
      });
    }, []);

    const reset = useCallback(() => {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        async getToken(): Promise<CaptchaResult> {
          if (!isCaptchaEnabled) return { status: "disabled" };
          try {
            await waitForReady();
            let token = captchaToken;
            if (!token) {
              const res = await captchaRef.current?.execute({ async: true });
              token = res?.response ?? null;
            }
            return token ? { status: "ok", token } : { status: "failed" };
          } catch {
            return { status: "failed" };
          } finally {
            // UN SOLO USO: reset siempre, haya éxito o fallo.
            captchaRef.current?.resetCaptcha();
            setCaptchaToken(null);
          }
        },
        reset,
      }),
      [captchaToken, reset, waitForReady]
    );

    if (!isCaptchaEnabled) return null;

    return (
      <HCaptcha
        ref={captchaRef}
        sitekey={SITE_KEY}
        size="invisible"
        onLoad={markReady}
        onVerify={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken(null)}
      />
    );
  }
);

export default InvisibleCaptcha;
