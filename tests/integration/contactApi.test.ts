// Contact API logic tests using pure processContact()
import { processContact, __resetContactRateLimit } from '@/app/api/contact/route';

function run(body: any, ip = '1.2.3.4') {
  return processContact(body, ip);
}

beforeEach(() => {
  __resetContactRateLimit();
});

describe('Contact API Route', () => {
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '',
    subject: 'Project Inquiry',
    message: 'This is a sufficiently long message about a custom project need that exceeds twenty chars.',
    projectType: 'furniture',
    budget: '1000-2500'
  };

  it('accepts a valid submission', () => {
    const res = run(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('rejects invalid email', () => {
    const res = run({ ...validPayload, email: 'bad' });
    expect(res.status).toBe(400);
  });

  it('rejects too short message', () => {
    const res = run({ ...validPayload, message: 'short msg' });
    expect(res.status).toBe(400);
  });

  it('blocks honeypot', () => {
    const res = run({ ...validPayload, _hp: 'bot-data' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('spam_detected');
  });

  it('rate limits after threshold', () => {
    for (let i = 0; i < 5; i++) {
      const r = run({ ...validPayload, subject: 'Project Inquiry ' + i }, '9.9.9.9');
      expect(r.status).toBe(200);
    }
    const limited = run({ ...validPayload, subject: 'Project Inquiry limited' }, '9.9.9.9');
    expect(limited.status).toBe(429);
  });
});
