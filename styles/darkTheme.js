// Dark Theme Design Tokens
// Based on premium dark UI reference

export const darkTheme = {
  // Background colors
  background: {
    primary: '#071422',      // Main app background
    panel: '#0f2430',        // Card/panel background
    glass: 'rgba(255, 255, 255, 0.04)', // Glass morphism
    glassHover: 'rgba(255, 255, 255, 0.08)',
    sidebar: 'rgba(15, 36, 48, 0.8)',
  },

  // Accent colors
  accent: {
    cyan: '#1bd3ff',         // Primary accent - cyan
    teal: '#2dd4bf',         // Secondary accent - teal
    purple: '#7c5cff',       // Tertiary accent - purple
    gradient: 'linear-gradient(135deg, #1bd3ff 0%, #2dd4bf 100%)',
    gradientPurple: 'linear-gradient(135deg, #7c5cff 0%, #a78bfa 100%)',
    glowCyan: '0 0 20px rgba(27, 211, 255, 0.3)',
    glowTeal: '0 0 20px rgba(45, 212, 191, 0.3)',
  },

  // Text colors
  text: {
    primary: '#e6f0f6',      // Main text
    secondary: '#9aa8b4',    // Muted text
    tertiary: '#64748b',     // Even more muted
    white: '#ffffff',
  },

  // Border & divider
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    accent: 'rgba(27, 211, 255, 0.3)',
  },

  // Shadows
  shadow: {
    soft: '0 8px 30px rgba(2, 8, 20, 0.6)',
    medium: '0 12px 40px rgba(2, 8, 20, 0.7)',
    strong: '0 20px 60px rgba(2, 8, 20, 0.8)',
    glow: '0 0 30px rgba(27, 211, 255, 0.2)',
    inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
  },

  // Border radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '14px',
    xl: '16px',
    full: '9999px',
  },

  // Transitions
  transition: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Sidebar specific
  sidebar: {
    width: '240px',
    activeBg: 'linear-gradient(90deg, rgba(27, 211, 255, 0.15) 0%, rgba(45, 212, 191, 0.1) 100%)',
    activeGlow: '0 0 15px rgba(27, 211, 255, 0.2)',
    hoverBg: 'rgba(255, 255, 255, 0.05)',
  },

  // Chart colors (for consistency)
  chart: {
    income: '#2dd4bf',       // Teal for income
    expense: '#7c5cff',      // Purple for expense
    grid: 'rgba(255, 255, 255, 0.08)',
    text: '#9aa8b4',
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

// Helper function to create gradient backgrounds
export const createGradient = (color1, color2, angle = 135) => {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
};

// Helper function for glass morphism effect
export const glassEffect = (opacity = 0.04, blur = 20) => `
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px) saturate(180%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(180%);
`;

// Helper function for card hover effect
export const cardHoverEffect = `
  transform: translateY(-4px);
  box-shadow: ${darkTheme.shadow.medium};
`;

export default darkTheme;