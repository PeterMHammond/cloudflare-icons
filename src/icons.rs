// Generated Cloudflare icons from official sources
// Total icons: 63

use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct IconData {
    pub svg: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub doc_url: &'static str,
}

pub fn list_icons() -> Vec<&'static str> {
    vec![
        "1.1.1.1",
        "access",
        "ai-gateway",
        "analytics-engine",
        "api-shield",
        "argo",
        "browser-isolation",
        "browser-rendering",
        "cache",
        "cache-reserve",
        "casb",
        "cloudflare",
        "cloudflare-one",
        "cloudflare-pages",
        "cloudflare-tunnel",
        "cloudflare-workers",
        "cloudflare-zero-trust",
        "d1",
        "ddos-protection",
        "dex",
        "dlp",
        "dns",
        "dnssec",
        "durable-objects",
        "email-routing",
        "email-security",
        "gateway",
        "hyperdrive",
        "images",
        "kv",
        "load-balancing",
        "logs",
        "magic-firewall",
        "magic-transit",
        "magic-wan",
        "network-interconnect",
        "page-shield",
        "pages",
        "pipelines",
        "pub-sub",
        "queues",
        "r2",
        "radar",
        "registrar",
        "ruleset-engine",
        "security-center",
        "spectrum",
        "ssl",
        "ssl-tls",
        "stream",
        "time-services",
        "turnstile",
        "vectorize",
        "waf",
        "waiting-room",
        "warp",
        "web-analytics",
        "workers",
        "workers-ai",
        "workers-durable-objects",
        "workers-kv",
        "wrangler",
        "zaraz",
    ]
}

pub fn get_icon_svg(name: &str) -> Option<String> {
    let icons = get_icons_map();
    icons.get(name).map(|data| data.svg.to_string())
}

pub fn get_icon_data(name: &str) -> Option<IconData> {
    let icons = get_icons_map();
    icons.get(name).cloned()
}

fn get_icons_map() -> HashMap<&'static str, IconData> {
    let mut icons = HashMap::new();
    
    icons.insert("1.1.1.1", IconData {
        svg: include_str!("../icons/1.1.1.1.svg"),
        name: "1.1.1.1",
        description: "A blazing fast DNS resolver built for private browsing.",
        doc_url: "https://developers.cloudflare.com/1.1.1.1/",
    });
    
    icons.insert("access", IconData {
        svg: include_str!("../icons/access.svg"),
        name: "Access",
        description: "Determine who can reach your application using policies.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/applications/",
    });
    
    icons.insert("ai-gateway", IconData {
        svg: include_str!("../icons/ai-gateway.svg"),
        name: "AI Gateway",
        description: "Manage and scale your generative AI workloads.",
        doc_url: "https://developers.cloudflare.com/ai-gateway/",
    });
    
    icons.insert("analytics-engine", IconData {
        svg: include_str!("../icons/analytics-engine.svg"),
        name: "Analytics Engine",
        description: "Build SQL-compatible, scalable time-series analytics without limits.",
        doc_url: "https://developers.cloudflare.com/analytics/analytics-engine/",
    });
    
    icons.insert("api-shield", IconData {
        svg: include_str!("../icons/api-shield.svg"),
        name: "API Shield",
        description: "Protect your API endpoints from abuse and attacks.",
        doc_url: "https://developers.cloudflare.com/api-shield/",
    });
    
    icons.insert("argo", IconData {
        svg: include_str!("../icons/argo.svg"),
        name: "Argo",
        description: "Accelerate traffic across Cloudflare's network.",
        doc_url: "https://developers.cloudflare.com/argo-smart-routing/",
    });
    
    icons.insert("browser-isolation", IconData {
        svg: include_str!("../icons/browser-isolation.svg"),
        name: "Browser Isolation",
        description: "Isolate risky web browsing to protect devices from threats.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/",
    });
    
    icons.insert("browser-rendering", IconData {
        svg: include_str!("../icons/browser-rendering.svg"),
        name: "Browser Rendering",
        description: "Browser Rendering can be used for browser automation, testing, web scraping, and taking screenshots.",
        doc_url: "https://developers.cloudflare.com/browser-rendering/",
    });
    
    icons.insert("cache", IconData {
        svg: include_str!("../icons/cache.svg"),
        name: "Cache",
        description: "Store copies of frequently accessed content in Cloudflare data centers.",
        doc_url: "https://developers.cloudflare.com/cache/",
    });
    
    icons.insert("cache-reserve", IconData {
        svg: include_str!("../icons/cache-reserve.svg"),
        name: "Cache Reserve",
        description: "Persistent cache storage to reduce origin requests.",
        doc_url: "https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/",
    });
    
    icons.insert("casb", IconData {
        svg: include_str!("../icons/casb.svg"),
        name: "CASB",
        description: "Cloud Access Security Broker for SaaS application security.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/applications/scan-apps/",
    });
    
    icons.insert("cloudflare", IconData {
        svg: include_str!("../icons/cloudflare.svg"),
        name: "Cloudflare",
        description: "The connectivity cloud that protects everything you connect to the Internet.",
        doc_url: "https://www.cloudflare.com/",
    });
    
    icons.insert("cloudflare-one", IconData {
        svg: include_str!("../icons/cloudflare-one.svg"),
        name: "Cloudflare One",
        description: "Connect and secure your teams, devices, and networks.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/",
    });
    
    icons.insert("cloudflare-pages", IconData {
        svg: include_str!("../icons/cloudflare-pages.svg"),
        name: "Cloudflare Pages",
        description: "Deploy dynamic front-end applications in record time.",
        doc_url: "https://developers.cloudflare.com/pages/",
    });
    
    icons.insert("cloudflare-tunnel", IconData {
        svg: include_str!("../icons/cloudflare-tunnel.svg"),
        name: "Cloudflare Tunnel",
        description: "Expose your services securely to the Internet from any network.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
    });
    
    icons.insert("cloudflare-workers", IconData {
        svg: include_str!("../icons/cloudflare-workers.svg"),
        name: "Cloudflare Workers",
        description: "Deploy serverless code instantly across the globe.",
        doc_url: "https://developers.cloudflare.com/workers/",
    });
    
    icons.insert("cloudflare-zero-trust", IconData {
        svg: include_str!("../icons/cloudflare-zero-trust.svg"),
        name: "Cloudflare Zero Trust",
        description: "Cloudflare Zero Trust replaces legacy security perimeters with Cloudflare's network, providing secure access to any application, on any device, in any location.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/",
    });
    
    icons.insert("d1", IconData {
        svg: include_str!("../icons/d1.svg"),
        name: "D1",
        description: "Managed, serverless database with SQLite's SQL semantics, built-in disaster recovery, and Worker and HTTP API access.",
        doc_url: "https://developers.cloudflare.com/d1/",
    });
    
    icons.insert("ddos-protection", IconData {
        svg: include_str!("../icons/ddos-protection.svg"),
        name: "DDoS Protection",
        description: "Automatic protection against Distributed Denial of Service attacks.",
        doc_url: "https://developers.cloudflare.com/ddos-protection/",
    });
    
    icons.insert("dex", IconData {
        svg: include_str!("../icons/dex.svg"),
        name: "Dex",
        description: "The digital experience monitoring solution for all your web properties and applications.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/insights/dex/",
    });
    
    icons.insert("dlp", IconData {
        svg: include_str!("../icons/dlp.svg"),
        name: "DLP",
        description: "Data Loss Prevention to protect sensitive data.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/policies/data-loss-prevention/",
    });
    
    icons.insert("dns", IconData {
        svg: include_str!("../icons/dns.svg"),
        name: "DNS",
        description: "Enterprises trust Cloudflare to be their authoritative DNS provider.",
        doc_url: "https://developers.cloudflare.com/dns/",
    });
    
    icons.insert("dnssec", IconData {
        svg: include_str!("../icons/dnssec.svg"),
        name: "DNSSEC",
        description: "Cryptographically sign DNS records to prevent tampering.",
        doc_url: "https://developers.cloudflare.com/dns/dnssec/",
    });
    
    icons.insert("durable-objects", IconData {
        svg: include_str!("../icons/durable-objects.svg"),
        name: "Durable Objects",
        description: "Low-latency coordination and consistent storage for distributed applications.",
        doc_url: "https://developers.cloudflare.com/durable-objects/",
    });
    
    icons.insert("email-routing", IconData {
        svg: include_str!("../icons/email-routing.svg"),
        name: "Email Routing",
        description: "Email Routing simplifies creating and managing custom email addresses for your domain.",
        doc_url: "https://developers.cloudflare.com/email-routing/",
    });
    
    icons.insert("email-security", IconData {
        svg: include_str!("../icons/email-security.svg"),
        name: "Email Security",
        description: "Cloud email security to safeguard against advanced threats.",
        doc_url: "https://developers.cloudflare.com/email-security/",
    });
    
    icons.insert("gateway", IconData {
        svg: include_str!("../icons/gateway.svg"),
        name: "Gateway",
        description: "A comprehensive Secure Web Gateway that protects your organization from threats.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/policies/gateway/",
    });
    
    icons.insert("hyperdrive", IconData {
        svg: include_str!("../icons/hyperdrive.svg"),
        name: "Hyperdrive",
        description: "Turn your existing regional database into a globally distributed database.",
        doc_url: "https://developers.cloudflare.com/hyperdrive/",
    });
    
    icons.insert("images", IconData {
        svg: include_str!("../icons/images.svg"),
        name: "Images",
        description: "Resize, optimize, and serve images from one unified API.",
        doc_url: "https://developers.cloudflare.com/images/",
    });
    
    icons.insert("kv", IconData {
        svg: include_str!("../icons/kv.svg"),
        name: "KV",
        description: "Globally distributed, low-latency key-value data storage.",
        doc_url: "https://developers.cloudflare.com/kv/",
    });
    
    icons.insert("load-balancing", IconData {
        svg: include_str!("../icons/load-balancing.svg"),
        name: "Load Balancing",
        description: "Increase application performance, availability, and scalability.",
        doc_url: "https://developers.cloudflare.com/load-balancing/",
    });
    
    icons.insert("logs", IconData {
        svg: include_str!("../icons/logs.svg"),
        name: "Logs",
        description: "Access detailed logs of your Cloudflare traffic and events.",
        doc_url: "https://developers.cloudflare.com/logs/",
    });
    
    icons.insert("magic-firewall", IconData {
        svg: include_str!("../icons/magic-firewall.svg"),
        name: "Magic Firewall",
        description: "Magic Firewall is a network-level firewall delivered through Cloudflare.",
        doc_url: "https://developers.cloudflare.com/magic-firewall/",
    });
    
    icons.insert("magic-transit", IconData {
        svg: include_str!("../icons/magic-transit.svg"),
        name: "Magic Transit",
        description: "DDoS protection and traffic acceleration for on-premise, cloud, and hybrid networks.",
        doc_url: "https://developers.cloudflare.com/magic-transit/",
    });
    
    icons.insert("magic-wan", IconData {
        svg: include_str!("../icons/magic-wan.svg"),
        name: "Magic WAN",
        description: "Secure your corporate network and simplify infrastructure management.",
        doc_url: "https://developers.cloudflare.com/magic-wan/",
    });
    
    icons.insert("network-interconnect", IconData {
        svg: include_str!("../icons/network-interconnect.svg"),
        name: "Network Interconnect",
        description: "Private network interconnections with Cloudflare.",
        doc_url: "https://developers.cloudflare.com/network-interconnect/",
    });
    
    icons.insert("page-shield", IconData {
        svg: include_str!("../icons/page-shield.svg"),
        name: "Page Shield",
        description: "Protect your website from malicious JavaScript.",
        doc_url: "https://developers.cloudflare.com/page-shield/",
    });
    
    icons.insert("pages", IconData {
        svg: include_str!("../icons/pages.svg"),
        name: "Pages",
        description: "Deploy dynamic front-end applications in record time.",
        doc_url: "https://developers.cloudflare.com/pages/",
    });
    
    icons.insert("pipelines", IconData {
        svg: include_str!("../icons/pipelines.svg"),
        name: "Pipelines",
        description: "Transform streaming data and route it to your destinations.",
        doc_url: "https://developers.cloudflare.com/pipelines/",
    });
    
    icons.insert("pub-sub", IconData {
        svg: include_str!("../icons/pub-sub.svg"),
        name: "Pub/Sub",
        description: "Communicate with your application infrastructure using Pub/Sub.",
        doc_url: "https://developers.cloudflare.com/pub-sub/",
    });
    
    icons.insert("queues", IconData {
        svg: include_str!("../icons/queues.svg"),
        name: "Queues",
        description: "Send, receive, and process messages with guaranteed delivery.",
        doc_url: "https://developers.cloudflare.com/queues/",
    });
    
    icons.insert("r2", IconData {
        svg: include_str!("../icons/r2.svg"),
        name: "R2",
        description: "Store large amounts of unstructured data without egress fees.",
        doc_url: "https://developers.cloudflare.com/r2/",
    });
    
    icons.insert("radar", IconData {
        svg: include_str!("../icons/radar.svg"),
        name: "Radar",
        description: "Internet traffic and attack trends data.",
        doc_url: "https://developers.cloudflare.com/radar/",
    });
    
    icons.insert("registrar", IconData {
        svg: include_str!("../icons/registrar.svg"),
        name: "Registrar",
        description: "Register and manage domain names.",
        doc_url: "https://developers.cloudflare.com/registrar/",
    });
    
    icons.insert("ruleset-engine", IconData {
        svg: include_str!("../icons/ruleset-engine.svg"),
        name: "Ruleset Engine",
        description: "Define and deploy rules across Cloudflare's edge.",
        doc_url: "https://developers.cloudflare.com/ruleset-engine/",
    });
    
    icons.insert("security-center", IconData {
        svg: include_str!("../icons/security-center.svg"),
        name: "Security Center",
        description: "Review and manage the security of your websites and applications.",
        doc_url: "https://developers.cloudflare.com/security-center/",
    });
    
    icons.insert("spectrum", IconData {
        svg: include_str!("../icons/spectrum.svg"),
        name: "Spectrum",
        description: "DDoS protection for any TCP or UDP-based application.",
        doc_url: "https://developers.cloudflare.com/spectrum/",
    });
    
    icons.insert("ssl", IconData {
        svg: include_str!("../icons/ssl.svg"),
        name: "SSL",
        description: "SSL/TLS encryption for your websites and APIs.",
        doc_url: "https://developers.cloudflare.com/ssl/",
    });
    
    icons.insert("ssl-tls", IconData {
        svg: include_str!("../icons/ssl-tls.svg"),
        name: "SSL/TLS",
        description: "Encrypt traffic to your website and APIs.",
        doc_url: "https://developers.cloudflare.com/ssl/",
    });
    
    icons.insert("stream", IconData {
        svg: include_str!("../icons/stream.svg"),
        name: "Stream",
        description: "Stream videos on-demand or live to millions of viewers.",
        doc_url: "https://developers.cloudflare.com/stream/",
    });
    
    icons.insert("time-services", IconData {
        svg: include_str!("../icons/time-services.svg"),
        name: "Time Services",
        description: "Accurate time synchronization services.",
        doc_url: "https://developers.cloudflare.com/time-services/",
    });
    
    icons.insert("turnstile", IconData {
        svg: include_str!("../icons/turnstile.svg"),
        name: "Turnstile",
        description: "Delivers frustration-free, CAPTCHA-free web experiences to website visitors.",
        doc_url: "https://developers.cloudflare.com/turnstile/",
    });
    
    icons.insert("vectorize", IconData {
        svg: include_str!("../icons/vectorize.svg"),
        name: "Vectorize",
        description: "Build full-stack AI applications with Cloudflare Workers.",
        doc_url: "https://developers.cloudflare.com/vectorize/",
    });
    
    icons.insert("waf", IconData {
        svg: include_str!("../icons/waf.svg"),
        name: "WAF",
        description: "Web Application Firewall (WAF) protects against sophisticated attacks.",
        doc_url: "https://developers.cloudflare.com/waf/",
    });
    
    icons.insert("waiting-room", IconData {
        svg: include_str!("../icons/waiting-room.svg"),
        name: "Waiting Room",
        description: "Manage traffic during peak times or special events.",
        doc_url: "https://developers.cloudflare.com/waiting-room/",
    });
    
    icons.insert("warp", IconData {
        svg: include_str!("../icons/warp.svg"),
        name: "WARP",
        description: "A modern, optimized, protocol that protects your device traffic.",
        doc_url: "https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/",
    });
    
    icons.insert("web-analytics", IconData {
        svg: include_str!("../icons/web-analytics.svg"),
        name: "Web Analytics",
        description: "Privacy-first analytics for your website.",
        doc_url: "https://developers.cloudflare.com/analytics/web-analytics/",
    });
    
    icons.insert("workers", IconData {
        svg: include_str!("../icons/workers.svg"),
        name: "Workers",
        description: "Deploy serverless code instantly across the globe.",
        doc_url: "https://developers.cloudflare.com/workers/",
    });
    
    icons.insert("workers-ai", IconData {
        svg: include_str!("../icons/workers-ai.svg"),
        name: "Workers AI",
        description: "Run AI models with serverless inference on Cloudflare's network.",
        doc_url: "https://developers.cloudflare.com/workers-ai/",
    });
    
    icons.insert("workers-durable-objects", IconData {
        svg: include_str!("../icons/workers-durable-objects.svg"),
        name: "Workers Durable Objects",
        description: "Globally unique instances for coordination and storage.",
        doc_url: "https://developers.cloudflare.com/durable-objects/",
    });
    
    icons.insert("workers-kv", IconData {
        svg: include_str!("../icons/workers-kv.svg"),
        name: "Workers KV",
        description: "Low-latency, key-value data storage.",
        doc_url: "https://developers.cloudflare.com/kv/",
    });
    
    icons.insert("wrangler", IconData {
        svg: include_str!("../icons/wrangler.svg"),
        name: "Wrangler",
        description: "Command-line tool for building Cloudflare Workers.",
        doc_url: "https://developers.cloudflare.com/workers/wrangler/",
    });
    
    icons.insert("zaraz", IconData {
        svg: include_str!("../icons/zaraz.svg"),
        name: "Zaraz",
        description: "Load third-party tools in the cloud.",
        doc_url: "https://developers.cloudflare.com/zaraz/",
    });
    
    icons
}