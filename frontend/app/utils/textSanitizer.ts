/**
 * Sanitizes Arabic text content to prevent hydration mismatches
 * This function normalizes Unicode characters and removes problematic formatting
 */
export function sanitizeArabicText(text: string): string {
  if (!text) return '';
  
  return text
    // Normalize Unicode characters
    .normalize('NFC')
    // Remove zero-width characters that might cause hydration issues
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove other problematic Unicode characters
    .replace(/[\u2060-\u2064\u206A-\u206F]/g, '')
    // Trim whitespace
    .trim();
}

/**
 * Safely renders text content with hydration warning suppression
 */
export function SafeText({ children, className = '', ...props }: { 
  children: string | null | undefined; 
  className?: string;
  [key: string]: any;
}) {
  const sanitizedText = sanitizeArabicText(children || '');
  
  return (
    <span className={className} suppressHydrationWarning {...props}>
      {sanitizedText}
    </span>
  );
}
