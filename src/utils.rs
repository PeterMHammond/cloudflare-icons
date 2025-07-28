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
    
    // Normalize viewBox to ensure consistent sizing
    standardized = normalize_viewbox(&standardized);
    
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

fn normalize_viewbox(svg: &str) -> String {
    let mut result = svg.to_string();
    
    // Check if it's the 1.1.1.1 icon (it has path data that goes beyond viewBox)
    if result.contains("M13 15.372") && result.contains("V57") {
        // Adjust viewBox to fit the actual content
        result = result.replace("viewBox=\"0 0 48 48\"", "viewBox=\"0 0 60 60\"");
    }
    // Check for icons with transform scales that need normalization
    else if result.contains("<g transform=\"scale(") {
        result = apply_transform_to_paths(&result);
    }
    // Ensure SVG has a viewBox for responsive scaling
    else if !result.contains("viewBox=") {
        result = result.replace("<svg", r#"<svg viewBox="0 0 48 48""#);
    }
    // Don't modify viewBox if it already has one - respect the original viewBox
    // This allows icons to have their proper 16x16 or 48x48 viewBoxes
    
    result
}


fn apply_transform_to_paths(svg: &str) -> String {
    // For SVGs with transform scales, we'll keep the transform
    // but adjust the viewBox to make the icon display at a consistent size
    let mut result = svg.to_string();
    
    // Icons with scale(3.000) are too small, so we need to zoom in the viewBox
    if result.contains("transform=\"scale(3.000)\"") {
        // These icons have 16x16 content scaled up to 48x48
        // We'll adjust the viewBox to show a smaller area, making the icon appear larger
        result = result.replace("viewBox=\"0 0 48 48\"", "viewBox=\"-8 -8 32 32\"");
    } 
    // Handle Pipelines icon with translate and scale
    else if result.contains("transform=\"translate(1.412 0.000) scale(2.824)\"") {
        // This icon needs special handling
        result = result.replace("viewBox=\"0 0 48 48\"", "viewBox=\"-4 -4 25 25\"");
    }
    
    result
}