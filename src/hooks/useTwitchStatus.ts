import { useEffect, useState } from 'react';
type TwitchStatus='loading'|'live'|'offline';
export function useTwitchStatus(channel='valentinavtt'){
  const [status,setStatus]=useState<TwitchStatus>('loading');
  useEffect(()=>{let active=true; const check=async()=>{try{const response=await fetch(`https://decapi.me/twitch/uptime/${channel}`); const text=await response.text(); if(active)setStatus(response.ok&&Boolean(text)&&!text.toLowerCase().includes('offline')?'live':'offline')}catch{if(active)setStatus('offline')}}; check(); const timer=window.setInterval(check,60000); return()=>{active=false;window.clearInterval(timer)}},[channel]);
  return {status,isLive:status==='live'};
}
