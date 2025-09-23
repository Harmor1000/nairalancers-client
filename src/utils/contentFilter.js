// Client-side content filtering utility for real-time feedback
class ClientContentFilter {
  constructor() {
    // Simplified patterns for client-side detection (less comprehensive than server-side)
    this.patterns = {
      email: [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g,
      ],
      
      phone: [
        /(?:call|text|phone|mobile|whatsapp)[\s:]*(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/gi,
        /(?:call|text|phone|mobile|whatsapp)[\s:]*(\+?234[-.\s]?)?[0-9]{10,11}\b/gi,
        /\b(my|our)\s+(phone|mobile|number)\s+(is|are)[\s:]*[0-9+\-.\s]{7,}\b/gi,
        /\b[0-9]{10,15}\b(?=\s*(is\s+my|for\s+contact|to\s+reach))/g
      ],
      
      social: [
        /(?:contact|reach|find)[\s\w]*@[A-Za-z0-9_]+\b/gi,
        /\b(instagram|insta|ig)[\s:]*(?:contact|dm|message)[\s:]*@?[A-Za-z0-9_.-]+\b/gi,
        /\b(twitter|tweet|tw)[\s:]*(?:contact|dm|message)[\s:]*@?[A-Za-z0-9_.-]+\b/gi,
        /\b(facebook|fb)[\s:]*(?:contact|message)[\s:]*@?[A-Za-z0-9_.-]+\b/gi,
        /\b(whatsapp|wa)[\s:]*(?:contact|message|chat)[\s:]*@?[A-Za-z0-9_.-]+\b/gi,
        /\b(telegram|tg)[\s:]*(?:contact|message)[\s:]*@?[A-Za-z0-9_.-]+\b/gi,
        /\b(discord)[\s:]*(?:contact|message)[\s:]*@?[A-Za-z0-9_.-]+#[0-9]{4}\b/gi,
      ],
      
      url: [
        /https?:\/\/(?!github\.com|behance\.net|dribbble\.com|linkedin\.com)[^\s]+/g,
        /www\.(?!github\.com|behance\.net|dribbble\.com|linkedin\.com)[^\s]+\.[a-z]{2,}/gi,
      ],
      
      messaging: [
        /\bskype[\s:]*(?:contact|message)[\s:]*[A-Za-z0-9_.-]+\b/gi,
        /\bzoom[\s:]*(?:contact|meeting)[\s:]*[A-Za-z0-9_.-]+\b/gi,
      ],
      
      obfuscated: [
        /\b(call|text|email|contact)\s+(me|us)\s+(at|on)\b/gi,
        /\b(my|our)\s+(number|phone|email|contact)\s+(is|are)\b/gi,
        /\b(communicate|talk|discuss)\s+(outside|off)\s+(here|platform|site)\b/gi,
      ]
    };

    // Warning messages for different types - more educational tone
    this.warningMessages = {
      email: "For your security, keep all communications on our platform instead of sharing email addresses.",
      phone: "Our platform messaging is secure and protects both parties. Avoid sharing phone numbers.",
      social: "Use our platform tools to share your portfolio instead of social media handles.",
      url: "Consider using our portfolio upload feature instead of external links for better security.",
      messaging: "Our built-in chat system provides better security than external messaging platforms.",
      obfuscated: "Please keep all project communications on our secure platform."
    };
  }

  /**
   * Quick client-side check for potential contact info
   * @param {string} content - Content to check
   * @returns {Object} - Check result
   */
  quickCheck(content) {
    if (!content || typeof content !== 'string') {
      return { hasViolations: false, warnings: [] };
    }

    const normalizedContent = this.normalizeContent(content);
    const violations = this.detectViolations(normalizedContent);

    return {
      hasViolations: violations.length > 0,
      warnings: violations.map(v => ({
        type: v.type,
        message: this.warningMessages[v.type] || "This content may violate our messaging guidelines.",
        matches: v.matches
      })),
      severity: this.calculateSeverity(violations)
    };
  }

  /**
   * Normalize content for analysis
   */
  normalizeContent(content) {
    let normalized = content.toLowerCase();
    
    // Remove HTML tags
    normalized = normalized.replace(/<[^>]*>/g, ' ');
    
    // Basic obfuscation handling
    normalized = normalized.replace(/\[at\]/gi, '@');
    normalized = normalized.replace(/\(at\)/gi, '@');
    normalized = normalized.replace(/\s*at\s*/gi, '@');
    normalized = normalized.replace(/\[dot\]/gi, '.');
    normalized = normalized.replace(/\(dot\)/gi, '.');
    normalized = normalized.replace(/\s*dot\s*/gi, '.');
    
    return normalized;
  }

  /**
   * Detect violations in content
   */
  detectViolations(normalizedContent) {
    const violations = [];

    Object.entries(this.patterns).forEach(([type, patterns]) => {
      const matches = [];
      
      patterns.forEach(pattern => {
        const found = normalizedContent.match(pattern);
        if (found) {
          matches.push(...found);
        }
      });

      if (matches.length > 0) {
        violations.push({
          type,
          matches: [...new Set(matches)] // Remove duplicates
        });
      }
    });

    return violations;
  }

  /**
   * Calculate severity level - more lenient
   */
  calculateSeverity(violations) {
    if (violations.length === 0) return 'none';
    if (violations.length > 4) return 'high'; // Increased threshold
    if (violations.some(v => ['obfuscated'].includes(v.type))) return 'high'; // Only obfuscated is high severity
    if (violations.some(v => ['email', 'phone'].includes(v.type)) && violations.length > 1) return 'medium';
    if (violations.length > 2) return 'medium'; // Increased threshold
    return 'low';
  }

  /**
   * Get user-friendly suggestions for clean communication
   */
  getCommuncationTips() {
    return [
      "Use our secure platform messaging to protect your privacy",
      "Share work samples through portfolio uploads instead of external links", 
      "Discuss project details openly in chat to build trust",
      "Use the order system for formal project agreements",
      "Our dispute resolution system protects both buyers and sellers"
    ];
  }

  /**
   * Validate message before sending (for real-time feedback)
   */
  validateMessage(content) {
    const check = this.quickCheck(content);
    
    if (!check.hasViolations) {
      return {
        isValid: true,
        canSend: true,
        feedback: null
      };
    }

    // Provide user feedback based on severity
    let feedback = {
      type: check.severity === 'high' ? 'error' : 'warning',
      message: '',
      suggestions: []
    };

    if (check.severity === 'high') {
      feedback.message = "Your message may contain contact information that should be avoided.";
      feedback.suggestions = [
        "Use our platform tools for sharing portfolios and work samples",
        "Keep all communications secure by using our messaging system",
        ...this.getCommuncationTips().slice(0, 2) // Fewer suggestions
      ];
      
      return {
        isValid: false,
        canSend: false,
        feedback,
        violations: check.warnings
      };
    } else {
      feedback.message = "Tip: Keep communications on our secure platform for the best experience.";
      feedback.suggestions = [
        "Use our portfolio upload feature for sharing work samples",
        "Focus on project-specific discussions"
      ];

      return {
        isValid: true,
        canSend: true,
        feedback,
        violations: check.warnings
      };
    }
  }

  /**
   * Clean content by removing detected patterns (basic client-side cleaning)
   */
  cleanContent(content) {
    if (!content) return content;

    let cleaned = content;
    const normalizedContent = this.normalizeContent(content);
    const violations = this.detectViolations(normalizedContent);

    // Simple replacement strategy
    violations.forEach(violation => {
      violation.matches.forEach(match => {
        const replacement = this.getReplacementText(violation.type);
        // Use case-insensitive replacement
        const regex = new RegExp(this.escapeRegExp(match), 'gi');
        cleaned = cleaned.replace(regex, replacement);
      });
    });

    return cleaned;
  }

  /**
   * Get replacement text for violations
   */
  getReplacementText(type) {
    const replacements = {
      email: '[email removed]',
      phone: '[phone removed]',
      social: '[social handle removed]',
      url: '[link removed]',
      messaging: '[contact info removed]',
      obfuscated: '[contact attempt removed]'
    };
    return replacements[type] || '[removed]';
  }

  /**
   * Escape regex special characters
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export singleton instance
export default new ClientContentFilter();

