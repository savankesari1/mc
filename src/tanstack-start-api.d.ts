// Type shim for @tanstack/react-start/api
// This subpath is resolved at build-time by the Lovable/Vite/Nitro toolchain.
// The IDE cannot find it via standard module resolution, so we declare it here.
declare module "@tanstack/react-start/api" {
  export function createAPIFileRoute(
    path: string,
  ): (handlers: {
    GET?: (ctx: { request: Request; params: Record<string, string> }) => Response | Promise<Response>;
    POST?: (ctx: { request: Request; params: Record<string, string> }) => Response | Promise<Response>;
    PUT?: (ctx: { request: Request; params: Record<string, string> }) => Response | Promise<Response>;
    DELETE?: (ctx: { request: Request; params: Record<string, string> }) => Response | Promise<Response>;
    PATCH?: (ctx: { request: Request; params: Record<string, string> }) => Response | Promise<Response>;
  }) => { APIRoute: unknown };
}
