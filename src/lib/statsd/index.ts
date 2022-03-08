import { StatsD } from "hot-shots";
export const dd = new StatsD({ sampleRate: 1 });

const onlineUsers: Map<number, number> = new Map();
export function online(id: number) {
  onlineUsers.set(id, Date.now());
}

setInterval(() => {
  for (let [id, lastSeen] of onlineUsers) {
    if (lastSeen < Date.now() - 300000) onlineUsers.delete(id);
  }

  dd.gauge("petal.traffic.online_users", onlineUsers.size);
}, 1000);
