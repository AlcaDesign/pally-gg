"use strict";var Pally=(()=>{var l=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var m=(a,i)=>{for(var e in i)l(a,e,{get:i[e],enumerable:!0})},v=(a,i,e,t)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of h(i))!g.call(a,n)&&n!==e&&l(a,n,{get:()=>i[n],enumerable:!(t=d(i,n))||t.enumerable});return a};var u=a=>v(l({},"__esModule",{value:!0}),a);var T={};m(T,{Client:()=>p,default:()=>f});var s=class{constructor(){this.events=new Map}emit(i,...e){let t=this.events.get(i);if(t)for(let n of t)n(...e)}on(i,e){let t=this.events.get(i)??[];t.push(e),this.events.set(i,t)}};var y="wss://events.pally.gg",p=class extends s{constructor(e){super();this.wasCloseCalled=!1;this.keepalive={lastPingAt:void 0,latencyMs:void 0,interval:void 0,intervalSeconds:e.keepalive?.intervalSeconds??60,pingTimeout:void 0,pingTimeoutSeconds:e.keepalive?.pingTimeoutSeconds??10,reconnectTimeout:void 0,reconnectAttempts:0},this.channel=e.channel??"firehose",this.room=this.channel==="activity-feed"?e.room:void 0,this.auth=e.auth}connect(){if(this.socket)throw new Error("Socket already connected");let e=new URLSearchParams({auth:this.auth,channel:this.channel});if(this.channel==="activity-feed"){if(!this.room)throw new Error('The "room" option is required when the channel is set to "activity-feed".');e.append("room",this.room)}let t=new WebSocket(`${y}?${e}`);this.socket=t,t.addEventListener("open",n=>this.handleOpen(n)),t.addEventListener("close",n=>this.handleClose(n)),t.addEventListener("error",n=>this.handleError(n)),t.addEventListener("message",n=>this.handleMessage(n))}close(){this.wasCloseCalled=!0,this.socket?.close()}handleOpen(e){this.keepalive.reconnectAttempts=0,this.ping(),this.setKeepaliveInterval(),this.emit("connect")}handleClose(e){if(this.stopKeepaliveInterval(),this.keepalive.lastPingAt=void 0,this.keepalive.latencyMs=void 0,this.socket=void 0,this.emit("close",e),this.wasCloseCalled)return;clearTimeout(this.keepalive.reconnectTimeout);let t=Math.min(++this.keepalive.reconnectAttempts**.4*100,1e4);this.keepalive.reconnectTimeout=setTimeout(()=>{this.keepalive.reconnectTimeout=void 0,this.emit("reconnecting"),this.connect()},t)}handleError(e){this.emit("error",e)}handleMessage(e){let t=Date.now(),n=e.data.toString();if(n==="pong"){clearTimeout(this.keepalive.pingTimeout),this.keepalive.latencyMs=t-this.keepalive.lastPingAt,this.emit("pong",this.keepalive.latencyMs);return}try{let o=JSON.parse(n);switch(o.type){case"campaigntip.notify":{let r=o.payload,c={...r.campaignTip,createdAt:new Date(r.campaignTip.createdAt),updatedAt:new Date(r.campaignTip.updatedAt)};this.emit("campaigntip.notify",c,r.page);break}}}catch(o){console.error("Error parsing message",o,n)}}ping(){if(!this.socket||this.socket.readyState!==WebSocket.OPEN)throw new Error("Socket not connected");this.socket.send("ping"),this.keepalive.lastPingAt=Date.now(),this.keepalive.pingTimeout=setTimeout(()=>{this.socket&&this.socket.close()},this.keepalive.pingTimeoutSeconds*1e3)}setKeepaliveInterval(){this.keepalive.interval&&clearInterval(this.keepalive.interval);let e=this.keepalive.intervalSeconds*1e3;this.keepalive.interval=setInterval(()=>this.ping(),e)}stopKeepaliveInterval(){clearInterval(this.keepalive.interval),clearTimeout(this.keepalive.pingTimeout)}send(e){this.socket?.send(JSON.stringify(e))}sendTest(){let e="campaigntip.notify",t={campaignTip:{id:"TEST",createdAt:"2024-03-13T18:02:33.743Z",updatedAt:"2024-03-13T18:02:33.743Z",grossAmountInCents:500,netAmountInCents:500,processingFeeInCents:0,displayName:"Someone",message:""},page:{id:"1627451579049x550722173620715500",slug:"pally",title:"Pally.gg's Team Page",url:"https://pally.gg/p/pally"}};this.send({type:"echo",payload:{type:e,payload:t}})}},f={Client:p};return u(T);})();
//# sourceMappingURL=pally.js.map
