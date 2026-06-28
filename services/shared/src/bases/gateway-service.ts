import { ApplicationServiceBase } from "./application-service.js";
import type { ServiceRequestContext } from "../types/service-context.js";

/** HTTP/API boundary services — validate inbound requests before domain work. */
export abstract class GatewayServiceBase extends ApplicationServiceBase {
  readonly domain = "gateway" as const;

  protected abstract validateRequest(ctx: ServiceRequestContext): void | Promise<void>;

  async withValidatedRequest<T>(
    ctx: ServiceRequestContext,
    handler: () => Promise<T>,
  ): Promise<T> {
    await this.validateRequest(ctx);
    return handler();
  }
}
