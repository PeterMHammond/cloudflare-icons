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