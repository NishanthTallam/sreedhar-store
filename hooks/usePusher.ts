"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export function getPusherClient() {
  if (!pusherClient) {
    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });
  }
  return pusherClient;
}

export function usePusher(
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) {
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);
    
    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
}
