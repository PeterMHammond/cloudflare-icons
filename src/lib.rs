use worker::*;
use serde::{Deserialize, Serialize};
use base64::{Engine as _, engine::general_purpose};

mod icons;
mod utils;

#[cfg(test)]
mod test_icons;

use icons::{get_icon_svg, get_icon_data, list_icons};
use utils::standardize_svg;

#[derive(Debug, Serialize, Deserialize)]
struct Icon {
    name: String,
    svg: String,
    excalidraw: String,
    doc_url: String,
}

#[event(fetch)]
async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
    utils::set_panic_hook();
    
    let router = Router::new();
    
    router
        .get_async("/", |_req, _ctx| async move {
            Response::from_html(render_index_page())
        })
        .get_async("/api/icons", |_req, _ctx| async move {
            let icons = list_icons();
            let icon_data: Vec<Icon> = icons.iter().map(|name| {
                let icon_info = get_icon_data(name);
                let (svg, doc_url) = match icon_info {
                    Some(data) => (data.svg.to_string(), data.doc_url.to_string()),
                    None => (String::new(), String::new()),
                };
                let standardized = standardize_svg(&svg);
                Icon {
                    name: name.to_string(),
                    svg: standardized.clone(),
                    excalidraw: svg_to_excalidraw(&standardized),
                    doc_url,
                }
            }).collect();
            
            Response::from_json(&icon_data)
        })
        .get_async("/api/excalidraw-backup", |_req, _ctx| async move {
            let icons = list_icons();
            let excalidraw_elements: Vec<serde_json::Value> = icons.iter().enumerate().map(|(i, name)| {
                let svg = get_icon_svg(name).unwrap_or_default();
                let standardized = standardize_svg(&svg);
                create_excalidraw_element(name, &standardized, i)
            }).collect();
            
            let backup = serde_json::json!({
                "type": "excalidraw",
                "version": 2,
                "source": "cloudflare-icons",
                "elements": excalidraw_elements,
                "appState": {
                    "gridSize": null,
                    "viewBackgroundColor": "#ffffff"
                },
                "files": {}
            });
            
            Response::from_json(&backup)
        })
        .run(req, env)
        .await
}

fn render_index_page() -> String {
    r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Icons Viewer</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .controls {
            max-width: 1400px;
            margin: 0 auto 30px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .search-box {
            flex: 1;
            min-width: 300px;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .btn {
            padding: 10px 20px;
            background: #F38020;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.2s;
        }
        .btn:hover {
            background: #e56f0f;
        }
        .icons-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .icon-container {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #e0e0e0;
            background: #fafafa;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }
        .icon-container:hover {
            border-color: #F38020;
            background: #fff;
        }
        .icon-container:hover::after {
            content: attr(data-name);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 6px 10px;
            background: #333;
            color: white;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            z-index: 10;
            pointer-events: none;
        }
        .icon-container:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 3px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #333;
            z-index: 10;
        }
        .icon-container svg {
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
            display: block;
            fill: #F38020;
        }
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            transform: translateY(100px);
            transition: transform 0.3s;
        }
        .toast.show {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <h1>Cloudflare Icons Viewer</h1>
    
    <div class="controls">
        <input type="text" class="search-box" id="searchBox" placeholder="Search icons...">
        <button class="btn" onclick="downloadExcalidrawBackup()">Download Excalidraw Backup</button>
    </div>
    
    <div class="icons-grid" id="iconsGrid"></div>
    
    <div class="toast" id="toast"></div>

    <script>
        let allIcons = [];
        
        async function loadIcons() {
            try {
                const response = await fetch('/api/icons');
                allIcons = await response.json();
                renderIcons(allIcons);
            } catch (error) {
                console.error('Failed to load icons:', error);
            }
        }
        
        function renderIcons(icons) {
            const grid = document.getElementById('iconsGrid');
            grid.innerHTML = icons.map(icon => {
                // Remove "cloudflare-" prefix from display name, keep main "cloudflare" icon as is
                const displayName = icon.name === 'cloudflare' ? icon.name : icon.name.replace(/^cloudflare-/, '');
                return `
                <div class="icon-container" data-name="${displayName}" data-icon-name="${icon.name}" title="Left-click: Open docs | Right-click: Copy SVG">
                    ${icon.svg}
                </div>
            `;
            }).join('');
        }
        
        function copyToExcalidraw(iconName) {
            const icon = allIcons.find(i => i.name === iconName);
            if (!icon) return;
            
            navigator.clipboard.writeText(icon.excalidraw).then(() => {
                showToast(`Copied ${iconName} to clipboard`);
            }).catch(err => {
                console.error('Failed to copy:', err);
                showToast('Failed to copy to clipboard');
            });
        }
        
        async function downloadExcalidrawBackup() {
            try {
                const response = await fetch('/api/excalidraw-backup');
                const data = await response.json();
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cloudflare-icons.excalidraw';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('Downloaded Excalidraw backup file');
            } catch (error) {
                console.error('Failed to download backup:', error);
                showToast('Failed to download backup');
            }
        }
        
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
        
        document.getElementById('searchBox').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allIcons.filter(icon => 
                icon.name.toLowerCase().includes(query)
            );
            renderIcons(filtered);
        });
        
        // Add event listeners for left-click and right-click
        document.addEventListener('click', (e) => {
            const iconContainer = e.target.closest('.icon-container');
            if (iconContainer) {
                e.preventDefault();
                const iconName = iconContainer.getAttribute('data-icon-name');
                const icon = allIcons.find(i => i.name === iconName);
                if (icon && icon.doc_url) {
                    window.open(icon.doc_url, '_blank');
                }
            }
        });
        
        document.addEventListener('contextmenu', (e) => {
            const iconContainer = e.target.closest('.icon-container');
            if (iconContainer) {
                e.preventDefault();
                const iconName = iconContainer.getAttribute('data-icon-name');
                const icon = allIcons.find(i => i.name === iconName);
                if (icon) {
                    navigator.clipboard.writeText(icon.svg).then(() => {
                        showToast(`Copied ${iconName} SVG to clipboard`);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                        showToast('Failed to copy to clipboard');
                    });
                }
            }
        });
        
        loadIcons();
    </script>
</body>
</html>"#.to_string()
}

fn svg_to_excalidraw(svg: &str) -> String {
    // For Excalidraw, we need to encode the SVG properly
    format!("data:image/svg+xml;base64,{}", general_purpose::STANDARD.encode(svg))
}

fn create_excalidraw_element(name: &str, svg: &str, index: usize) -> serde_json::Value {
    let x = (index % 10) as f64 * 150.0;
    let y = (index / 10) as f64 * 150.0;
    
    serde_json::json!({
        "id": format!("cf-icon-{}", name),
        "type": "image",
        "x": x,
        "y": y,
        "width": 48,
        "height": 48,
        "angle": 0,
        "strokeColor": "transparent",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 0,
        "opacity": 100,
        "seed": index,
        "version": 1,
        "versionNonce": index,
        "isDeleted": false,
        "boundElements": null,
        "updated": 1,
        "link": null,
        "locked": false,
        "fileId": format!("cf-{}", name),
        "scale": [1, 1],
        "mimeType": "image/svg+xml",
        "dataURL": svg_to_excalidraw(svg)
    })
}