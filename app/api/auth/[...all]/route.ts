import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

function fixRequestUrl(request: NextRequest) {
  if (process.env.BETTER_AUTH_URL && request.url.startsWith("http://localhost")) {
    const url = new URL(request.url);
    const newUrl = process.env.BETTER_AUTH_URL.replace(/\/$/, "") + url.pathname + url.search;
    
    // Create a proxy that overrides the 'url' property but delegates everything else to the original request
    return new Proxy(request, {
      get(target, prop, receiver) {
        if (prop === "url") {
          return newUrl;
        }
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      }
    });
  }
  return request;
}

export async function GET(request: NextRequest) {
  return auth.handler(fixRequestUrl(request));
}

export async function POST(request: NextRequest) {
  return auth.handler(fixRequestUrl(request));
}