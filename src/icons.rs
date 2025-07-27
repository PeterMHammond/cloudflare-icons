// This module contains embedded Cloudflare icons
// In production, these would be extracted from @cloudflare/component-icon or Simple Icons

use std::collections::HashMap;

pub fn list_icons() -> Vec<&'static str> {
    vec![
        "cloudflare",
        "workers",
        "pages",
        "r2",
        "d1",
        "kv",
        "durable-objects",
        "analytics",
        "stream",
        "images",
        "warp",
        "access",
        "gateway",
        "tunnel",
        "waiting-room",
        "load-balancing",
        "spectrum",
        "magic-wan",
        "radar",
        "security-center",
    ]
}

pub fn get_icon_svg(name: &str) -> Option<String> {
    let icons = get_icons_map();
    icons.get(name).map(|s| s.to_string())
}

fn get_icons_map() -> HashMap<&'static str, &'static str> {
    let mut icons = HashMap::new();
    
    // Cloudflare logo
    icons.insert("cloudflare", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.4785-1.0605-.4785H8.9424c-.2998 0-.5215-.2998-.4316-.5859.1113-.3594.3657-.5976.6777-.5976h6.5024c.3442 0 .6562-.2002.8174-.5215.161-.3213.1395-.7026-.0645-.9854-.7554-.9922-1.9551-1.6582-3.3857-1.6582-1.1167 0-2.1230.4639-2.8247 1.2207-.7017.7569-1.0283 1.8252-.8984 2.9390v.0107c0 .0322-.0107.0645-.0322.0967l-.8555 1.4902c-.0429.0859-.1289.1289-.2148.1289-.0967 0-.1826-.0645-.2041-.1611l-.3765-2.3413c-.0322-.2246-.2354-.3877-.4639-.3877H4.8811c-.3335 0-.6133.2783-.6133.6133 0 .3335.2783.6133.6133.6133h1.3047l.5918 3.7275c.0322.2139.2246.3770.4424.3770h8.4741c1.3154 0 2.4585-.7876 2.9605-2.0303zm4.3608-10.7275c-.3228 0-.6348.0967-.9029.2676-.1826-.0322-.3765-.0537-.5811-.0537-1.3584 0-2.4585.9136-2.7832 2.1730-.3765-.2891-.8447-.4531-1.3584-.4531-1.0068 0-1.8770.6455-2.1838 1.5869-.0107 0-.0215.0107-.0322.0107h-5.9219c-.3335 0-.6133.2783-.6133.6133s.2783.6133.6133.6133h5.6006c.1182 0 .2246.0322.3228.0859.4639-.5488.9707-.9922 1.5195-1.3154 1.0713-.6455 2.2949-.8555 3.4746-.6025.2891.0645.5703.1611.8232.2891.5918.2998 1.0820.7783 1.3906 1.3584.5381.9814.4746 2.1945-.1934 3.0928-.0215.0322-.0322.0645-.0322.1074 0 .0967.0752.1719.1719.1719h.7139c.3013 0 .5596-.2139.6240-.5059l1.1230-5.6865c.0215-.1074.0322-.2139.0322-.3228-.0107-1.3584-1.1338-2.4370-2.5127-2.4263z"/></svg>"#);
    
    // Workers
    icons.insert("workers", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v9.82c0 4.28-2.88 8.3-7 9.46V11h-2v7.46c-4.12-1.16-7-5.18-7-9.46V7.18l8-4z"/></svg>"#);
    
    // Pages
    icons.insert("pages", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/></svg>"#);
    
    // R2
    icons.insert("r2", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>"#);
    
    // D1
    icons.insert("d1", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6H4V4h16v2zm0 4H4v2h16v-2zm0 6H4v2h16v-2zM2 20h20v2H2z"/></svg>"#);
    
    // KV
    icons.insert("kv", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>"#);
    
    // Durable Objects
    icons.insert("durable-objects", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>"#);
    
    // Analytics
    icons.insert("analytics", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>"#);
    
    // Stream
    icons.insert("stream", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>"#);
    
    // Images
    icons.insert("images", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>"#);
    
    // Warp
    icons.insert("warp", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 9h2v2h-2zm-2 2h2v2H9zm4 0h2v2h-2zm2-2h2v2h-2zM7 9h2v2H7zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/></svg>"#);
    
    // Access
    icons.insert("access", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>"#);
    
    // Gateway
    icons.insert("gateway", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>"#);
    
    // Tunnel
    icons.insert("tunnel", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></svg>"#);
    
    // Waiting Room
    icons.insert("waiting-room", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>"#);
    
    // Load Balancing
    icons.insert("load-balancing", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 9h4v2H4zm16 0h-8v2h8zm-16 4h8v2H4zm12 0h4v2h-4z"/></svg>"#);
    
    // Spectrum
    icons.insert("spectrum", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>"#);
    
    // Magic WAN
    icons.insert("magic-wan", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>"#);
    
    // Radar
    icons.insert("radar", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><circle fill="currentColor" cx="12" cy="12" r="3"/></svg>"#);
    
    // Security Center
    icons.insert("security-center", r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>"#);
    
    icons
}