# Cloudflare Icons Viewer

A Rust/WebAssembly application for viewing and exporting Cloudflare icons, deployable to Cloudflare Workers.

## Features

- Display all Cloudflare SVG icons in a searchable grid
- Standardized 24x24 sizing with Cloudflare orange (#F38020)
- Click to copy icon data for Excalidraw
- Download complete Excalidraw backup file with all icons
- Pure Rust/WASM implementation - no TypeScript!

## Prerequisites

- Rust toolchain with wasm32 target
- Wrangler CLI for Cloudflare Workers
- Node.js (only for extracting icons from NPM packages)

## Setup

1. Install Rust dependencies:
```bash
rustup target add wasm32-unknown-unknown
cargo install worker-build
```

2. (Optional) Extract more icons from NPM:
```bash
npm install
npm run extract-icons
```

3. Configure your Cloudflare Workers KV namespace:
   - Create a KV namespace in your Cloudflare dashboard
   - Update the IDs in `wrangler.toml`

## Development

```bash
wrangler dev
```

## Deployment

```bash
wrangler deploy
```

## Architecture

- `/src/lib.rs` - Main Worker entry point and routes
- `/src/icons.rs` - Embedded icon SVG data
- `/src/utils.rs` - SVG standardization utilities
- Frontend uses vanilla JavaScript for simplicity
- Icons are embedded at compile time for optimal performance

## Icon Sources

Icons can be extracted from:
- `@cloudflare/component-icon` NPM package
- Simple Icons collection
- Or manually added to `src/icons.rs`

## Excalidraw Integration

Each icon can be:
- Clicked to copy as base64-encoded SVG for Excalidraw
- Downloaded as part of a complete `.excalidraw` backup file