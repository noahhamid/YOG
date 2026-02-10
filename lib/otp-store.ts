// Shared OTP store across all API routes
// In production, use Redis instead of Map

interface OTPData {
  code: string;
  expiresAt: number;
}

class OTPStore {
  private store: Map<string, OTPData>;

  constructor() {
    this.store = new Map();
  }

  set(email: string, code: string, expiresInMinutes: number = 5) {
    this.store.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
    });
  }

  get(email: string): OTPData | null {
    return this.store.get(email.toLowerCase()) || null;
  }

  delete(email: string) {
    this.store.delete(email.toLowerCase());
  }

  // Clean up expired OTPs periodically
  cleanup() {
    const now = Date.now();
    for (const [email, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(email);
      }
    }
  }
}

// Export singleton instance
export const otpStore = new OTPStore();

// Cleanup every 5 minutes
setInterval(() => otpStore.cleanup(), 5 * 60 * 1000);