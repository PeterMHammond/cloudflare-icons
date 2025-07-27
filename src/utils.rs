use std::sync::Once;

static SET_PANIC_HOOK: Once = Once::new();

pub fn set_panic_hook() {
    SET_PANIC_HOOK.call_once(|| {
        console_error_panic_hook::set_once();
    });
}

pub fn standardize_svg(svg: &str) -> String {
    let mut standardized = svg.to_string();
    
    // Replace fill colors with Cloudflare orange
    standardized = regex_replace(&standardized, r#"fill="[^"]*""#, r##"fill="#F38020""##);
    
    // Also handle currentColor
    standardized = standardized.replace("currentColor", "#F38020");
    
    // Remove width and height attributes to allow CSS sizing
    standardized = remove_svg_attribute(&standardized, "width");
    standardized = remove_svg_attribute(&standardized, "height");
    
    // Normalize viewBox to consistent size
    standardized = normalize_viewbox(&standardized);
    
    standardized
}

fn regex_replace(text: &str, pattern: &str, replacement: &str) -> String {
    // Simple regex-like replacement without regex crate
    let mut result = text.to_string();
    
    // This is a simplified implementation - in production you'd use the regex crate
    // For now, we'll do basic string replacement
    if pattern.contains("viewBox=") {
        if let Some(start) = result.find("viewBox=\"") {
            if let Some(end) = result[start+9..].find("\"") {
                let before = &result[..start];
                let after = &result[start+9+end+1..];
                result = format!("{}{}{}", before, replacement, after);
            }
        }
    } else if pattern.contains("width=") {
        if let Some(start) = result.find("width=\"") {
            if let Some(end) = result[start+7..].find("\"") {
                let before = &result[..start];
                let after = &result[start+7+end+1..];
                result = format!("{}{}{}", before, replacement, after);
            }
        }
    } else if pattern.contains("height=") {
        if let Some(start) = result.find("height=\"") {
            if let Some(end) = result[start+8..].find("\"") {
                let before = &result[..start];
                let after = &result[start+8+end+1..];
                result = format!("{}{}{}", before, replacement, after);
            }
        }
    } else if pattern.contains("fill=") {
        // Replace all fill attributes
        let mut working = result.clone();
        let mut final_result = String::new();
        
        while let Some(start) = working.find("fill=\"") {
            final_result.push_str(&working[..start]);
            final_result.push_str(replacement);
            
            if let Some(end) = working[start+6..].find("\"") {
                working = working[start+6+end+1..].to_string();
            } else {
                break;
            }
        }
        final_result.push_str(&working);
        result = final_result;
    }
    
    result
}

fn remove_svg_attribute(svg: &str, attr: &str) -> String {
    let mut result = svg.to_string();
    
    // Find and remove the attribute
    while let Some(start) = result.find(&format!("{}=\"", attr)) {
        if let Some(end) = result[start..].find("\"") {
            if let Some(next_quote) = result[start + end + 1..].find("\"") {
                // Remove the attribute including leading space if present
                let attr_start = if start > 0 && &result[start-1..start] == " " {
                    start - 1
                } else {
                    start
                };
                let attr_end = start + end + 1 + next_quote + 1;
                result = format!("{}{}", &result[..attr_start], &result[attr_end..]);
            } else {
                break;
            }
        } else {
            break;
        }
    }
    
    result
}

fn normalize_viewbox(svg: &str) -> String {
    // Target viewBox size for consistency
    const TARGET_SIZE: f64 = 48.0;
    
    // Extract current viewBox
    if let Some(viewbox_start) = svg.find("viewBox=\"") {
        let viewbox_value_start = viewbox_start + 9;
        if let Some(viewbox_end) = svg[viewbox_value_start..].find("\"") {
            let viewbox_value = &svg[viewbox_value_start..viewbox_value_start + viewbox_end];
            
            // Parse viewBox values (expecting "min_x min_y width height")
            let parts: Vec<&str> = viewbox_value.split_whitespace().collect();
            if parts.len() == 4 {
                if let (Ok(min_x), Ok(min_y), Ok(width), Ok(height)) = (
                    parts[0].parse::<f64>(),
                    parts[1].parse::<f64>(),
                    parts[2].parse::<f64>(),
                    parts[3].parse::<f64>()
                ) {
                    // If already the target size, return as-is
                    if width == TARGET_SIZE && height == TARGET_SIZE {
                        return svg.to_string();
                    }
                    
                    // Calculate scale factor
                    let scale = TARGET_SIZE / width.max(height);
                    
                    // Create new viewBox
                    let new_viewbox = format!("viewBox=\"0 0 {} {}\"", TARGET_SIZE, TARGET_SIZE);
                    
                    // Replace old viewBox with new one
                    let mut result = svg.to_string();
                    result = result.replace(
                        &format!("viewBox=\"{}\"", viewbox_value),
                        &new_viewbox
                    );
                    
                    // If the original viewBox wasn't square or had non-zero min values,
                    // we need to wrap the content in a transform group
                    if width != height || min_x != 0.0 || min_y != 0.0 {
                        // Calculate centering offsets for non-square SVGs
                        let scaled_width = width * scale;
                        let scaled_height = height * scale;
                        let offset_x = (TARGET_SIZE - scaled_width) / 2.0 - min_x * scale;
                        let offset_y = (TARGET_SIZE - scaled_height) / 2.0 - min_y * scale;
                        
                        // Find where to insert the transform group
                        if result.find(">").is_some() {
                            let transform = format!(
                                "><g transform=\"translate({:.3} {:.3}) scale({:.3})\">",
                                offset_x, offset_y, scale
                            );
                            result = result.replacen(">", &transform, 1);
                            
                            // Close the group before closing svg tag
                            if let Some(close_svg) = result.rfind("</svg>") {
                                result.insert_str(close_svg, "</g>");
                            }
                        }
                    } else {
                        // For square SVGs with 0,0 origin, just scale the content
                        if scale != 1.0 {
                            if result.find(">").is_some() {
                                let transform = format!(
                                    "><g transform=\"scale({:.3})\">",
                                    scale
                                );
                                result = result.replacen(">", &transform, 1);
                                
                                // Close the group before closing svg tag
                                if let Some(close_svg) = result.rfind("</svg>") {
                                    result.insert_str(close_svg, "</g>");
                                }
                            }
                        }
                    }
                    
                    return result;
                }
            }
        }
    }
    
    // If we couldn't parse viewBox, return original
    svg.to_string()
}