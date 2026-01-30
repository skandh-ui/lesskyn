import dns from "dns";

// Fix DNS resolution issues - must run before any MongoDB connections
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

console.log("DNS servers configured:", dns.getServers());
