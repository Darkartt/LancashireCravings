import { z } from 'zod';

// Simple in-memory rate limiting (non-durable; replace for production)
const RATE_LIMIT_MAX = 5; // requests per window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const requestLog: Record<string, number[]> = {};

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(190),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().min(5).max(150),
  message: z.string().min(20).max(5000),
  projectType: z.string().min(1).max(60),
  budget: z.string().min(1).max(40),
  _hp: z.string().optional() // honeypot
});

function isSpam(message: string) {
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 5) return true;
  const uniqueChars = new Set(message.replace(/\s+/g, ''));
  if (uniqueChars.size < 5 && message.length > 30) return true;
  return false;
}

function rateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  requestLog[key] = (requestLog[key] || []).filter(ts => ts > windowStart);
  if (requestLog[key].length >= RATE_LIMIT_MAX) return false;
  requestLog[key].push(now);
  return true;
}

export function processContact(body: unknown, ip: string): { status: number; body: any } {
  if (!rateLimit(ip)) {
    return { status: 429, body: { error: 'rate_limited' } };
  }
  if (!body || typeof body !== 'object') {
    return { status: 400, body: { error: 'invalid_json' } };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, body: { error: 'validation', details: parsed.error.flatten() } };
  }
  const { _hp, message } = parsed.data as any;
  if (_hp && _hp.trim() !== '') {
    return { status: 400, body: { error: 'spam_detected' } };
  }
  if (isSpam(message)) {
    return { status: 400, body: { error: 'spam_content' } };
  }
  return { status: 200, body: { ok: true } };
}

export function __resetContactRateLimit() {
  Object.keys(requestLog).forEach(k => { delete requestLog[k]; });
}
