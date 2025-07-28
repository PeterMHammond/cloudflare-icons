use std::sync::Once;

static SET_PANIC_HOOK: Once = Once::new();

pub fn set_panic_hook() {
    SET_PANIC_HOOK.call_once(|| {
        console_error_panic_hook::set_once();
    });
}

pub fn standardize_svg(svg: &str) -> String {
    // Basic SVG standardization with string operations
    // This is optimized for Cloudflare Workers runtime
    let mut standardized = svg.to_string();
    
    // Ensure xmlns is present
    if !standardized.contains("xmlns=") {
        standardized = standardized.replace("<svg", r#"<svg xmlns="http://www.w3.org/2000/svg""#);
    }
    
    // Replace fill colors with Cloudflare orange - more robust pattern
    standardized = replace_fill_colors(&standardized, "#F38020");
    
    // Remove width and height attributes to allow CSS sizing
    standardized = remove_svg_attribute(&standardized, "width");
    standardized = remove_svg_attribute(&standardized, "height");
    
    // Ensure consistent viewBox
    standardized = ensure_viewbox(&standardized);
    
    standardized
}

fn replace_fill_colors(svg: &str, color: &str) -> String {
    let result = svg.to_string();
    
    // Replace fill="anything" with our color
    let mut working = result.clone();
    let mut final_result = String::new();
    
    while let Some(start) = working.find("fill=\"") {
        final_result.push_str(&working[..start]);
        final_result.push_str(&format!("fill=\"{}\"", color));
        
        if let Some(end) = working[start+6..].find("\"") {
            working = working[start+6+end+1..].to_string();
        } else {
            break;
        }
    }
    final_result.push_str(&working);
    
    // Also replace currentColor
    final_result.replace("currentColor", color)
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

fn ensure_viewbox(svg: &str) -> String {
    // Ensure SVG has a viewBox for responsive scaling
    if svg.contains("viewBox=") {
        svg.to_string()
    } else {
        // Add a default 48x48 viewBox if none exists
        svg.replace("<svg", r#"<svg viewBox="0 0 48 48""#)
    }
}