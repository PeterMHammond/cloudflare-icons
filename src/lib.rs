use worker::*;
use serde::{Deserialize, Serialize};
use base64::{Engine as _, engine::general_purpose};

mod icons;
mod utils;


use icons::{get_icon_svg, get_icon_data, list_icons};
use utils::standardize_svg;

#[derive(Debug, Serialize, Deserialize)]
struct Icon {
    name: String,
    svg: String,
    excalidraw: String,
    description: String,
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
                match icon_info {
                    Some(data) => {
                        let standardized = standardize_svg(&data.svg);
                        Icon {
                            name: data.name.to_string(),
                            svg: standardized.clone(),
                            excalidraw: svg_to_excalidraw(&standardized),
                            description: data.description.to_string(),
                            doc_url: data.doc_url.to_string(),
                        }
                    },
                    None => Icon {
                        name: name.to_string(),
                        svg: String::new(),
                        excalidraw: String::new(),
                        description: "Cloudflare product".to_string(),
                        doc_url: "https://developers.cloudflare.com/".to_string(),
                    },
                }
            }).collect();
            
            Response::from_json(&icon_data)
        })
        .get_async("/api/excalidraw-backup", |_req, _ctx| async move {
            let icons = list_icons();
            let mut files = serde_json::Map::new();
            let mut excalidraw_elements: Vec<serde_json::Value> = Vec::new();
            
            for (i, name) in icons.iter().enumerate() {
                let icon_info = get_icon_data(name);
                let svg = get_icon_svg(name).unwrap_or_default();
                let standardized = standardize_svg(&svg);
                let label = icon_info.map(|data| data.name).unwrap_or(name);
                let file_id = format!("cf-{}", name);
                
                // Add file data to files map
                files.insert(file_id.clone(), serde_json::json!({
                    "mimeType": "image/svg+xml",
                    "id": file_id.clone(),
                    "dataURL": svg_to_excalidraw(&standardized),
                    "created": 1700000000000i64,
                    "lastRetrieved": 1700000000000i64
                }));
                
                // Create both image and text elements
                let (image_elem, text_elem) = create_excalidraw_elements(name, &file_id, i, &label);
                excalidraw_elements.push(image_elem);
                excalidraw_elements.push(text_elem);
            }
            
            let backup = serde_json::json!({
                "type": "excalidraw",
                "version": 2,
                "source": "cloudflare-icons",
                "elements": excalidraw_elements,
                "appState": {
                    "gridSize": null,
                    "viewBackgroundColor": "#ffffff"
                },
                "files": files
            });
            
            Response::from_json(&backup)
        })
        .run(req, env)
        .await
}

fn render_index_page() -> String {
    include_str!("index.html").to_string()
}

fn svg_to_excalidraw(svg: &str) -> String {
    // For Excalidraw, we need to encode the SVG properly
    format!("data:image/svg+xml;base64,{}", general_purpose::STANDARD.encode(svg))
}

fn create_excalidraw_elements(name: &str, file_id: &str, index: usize, label: &str) -> (serde_json::Value, serde_json::Value) {
    let x = (index % 10) as f64 * 150.0;
    let y = (index / 10) as f64 * 150.0;
    
    // Create a unique group ID for this icon and its label
    let group_id = format!("group-{}", name);
    
    // Image element
    let image_element = serde_json::json!({
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
        "fileId": file_id,
        "scale": [1, 1],
        "groupIds": [group_id.clone()]
    });
    
    // Text element - positioned below the icon
    // Handle multi-word labels by adding line breaks
    let text_content = if label.contains(' ') {
        label.to_lowercase().replace(" ", "\n")
    } else {
        label.to_lowercase()
    };
    
    // Adjust height for multi-line text
    let text_height = if label.contains(' ') { 40 } else { 20 };
    
    let text_element = serde_json::json!({
        "id": format!("text-{}", name),
        "type": "text",
        "x": x, // Center of icon (same x as icon)
        "y": y + 44.5, // Position below icon (48 height + spacing)
        "width": 48, // Match icon width
        "height": text_height,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "seed": index + 1000000,
        "version": 1,
        "versionNonce": index + 1000000,
        "isDeleted": false,
        "boundElements": null,
        "updated": 1,
        "link": null,
        "locked": false,
        "text": text_content.clone(),
        "fontSize": 16,
        "fontFamily": 5, // Excalifont
        "textAlign": "center",
        "verticalAlign": "top",
        "baseline": 14,
        "containerId": null,
        "originalText": text_content,
        "autoResize": false,
        "lineHeight": 1.25,
        "groupIds": [group_id]
    });
    
    (image_element, text_element)
}