export interface RateLimitMetrics {
  allowed: number;
  blocked: number;
  windowMs: number;
  maxRequests: number;
}

export interface EmailMetrics {
  sent: number;
  failed: number;
}

export interface SecurityEventMetrics {
  authFailures: number;
  tenantViolations: number;
  rateLimitBlocks: number;
}

export interface OperationalMetricsSnapshot {
  requestsTotal: number;
  rateLimit: RateLimitMetrics;
  email: EmailMetrics;
  security: SecurityEventMetrics;
  cacheHits: number;
  cacheMisses: number;
  jobEnqueued: number;
  jobCompleted: number;
  jobFailed: number;
  cognitiveRequests: number;
  aiRequests: number;
  timestamp: string;
}

/** In-process operational counters — exported via /api/ops/status. */
export class OperationalMetricsCollector {
  private requestsTotal = 0;
  private rateLimitAllowed = 0;
  private rateLimitBlocked = 0;
  private emailSent = 0;
  private emailFailed = 0;
  private authFailures = 0;
  private tenantViolations = 0;
  private cacheHits = 0;
  private cacheMisses = 0;
  private jobEnqueued = 0;
  private jobCompleted = 0;
  private jobFailed = 0;
  private cognitiveRequests = 0;
  private aiRequests = 0;

  recordRequest(): void {
    this.requestsTotal += 1;
  }

  recordRateLimitAllowed(): void {
    this.rateLimitAllowed += 1;
  }

  recordRateLimitBlocked(): void {
    this.rateLimitBlocked += 1;
  }

  recordEmailSent(): void {
    this.emailSent += 1;
  }

  recordEmailFailed(): void {
    this.emailFailed += 1;
  }

  recordAuthFailure(): void {
    this.authFailures += 1;
  }

  recordTenantViolation(): void {
    this.tenantViolations += 1;
  }

  setCacheMetrics(hits: number, misses: number): void {
    this.cacheHits = hits;
    this.cacheMisses = misses;
  }

  setJobMetrics(enqueued: number, completed: number, failed: number): void {
    this.jobEnqueued = enqueued;
    this.jobCompleted = completed;
    this.jobFailed = failed;
  }

  recordCognitiveRequest(): void {
    this.cognitiveRequests += 1;
  }

  recordAiRequest(): void {
    this.aiRequests += 1;
  }

  snapshot(rateLimit: { windowMs: number; maxRequests: number }): OperationalMetricsSnapshot {
    return {
      requestsTotal: this.requestsTotal,
      rateLimit: {
        allowed: this.rateLimitAllowed,
        blocked: this.rateLimitBlocked,
        windowMs: rateLimit.windowMs,
        maxRequests: rateLimit.maxRequests,
      },
      email: { sent: this.emailSent, failed: this.emailFailed },
      security: {
        authFailures: this.authFailures,
        tenantViolations: this.tenantViolations,
        rateLimitBlocks: this.rateLimitBlocked,
      },
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      jobEnqueued: this.jobEnqueued,
      jobCompleted: this.jobCompleted,
      jobFailed: this.jobFailed,
      cognitiveRequests: this.cognitiveRequests,
      aiRequests: this.aiRequests,
      timestamp: new Date().toISOString(),
    };
  }
}
