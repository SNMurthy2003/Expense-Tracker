// Zeminent Design System Theme
// Purple-based dark theme matching Zeminent agency design

export const darkTheme = {
  // Background colors
  background: {
    primary: '#000000',      // Pure black main background
    panel: '#000000',        // Black card/panel background
    glass: 'rgba(255, 255, 255, 0.05)', // Glass morphism
    glassHover: 'rgba(255, 255, 255, 0.08)',
    sidebar: 'rgba(0, 0, 0, 0.9)',
    gradient: 'linear-gradient(135deg, #0D0A15 0%, #1a1a2e 50%, #16213e 100%)', // Hero gradient
  },

  // Brand colors - Zeminent purple palette
  brand: {
    primary: '#B065FF',      // Main brand purple
    primaryHover: '#9a4df5', // Hover state
    secondary: '#7c3aed',    // Secondary purple
    accent: '#a855f7',       // Accent purple
    gradient: 'linear-gradient(135deg, #4D00FF 0%, #0A00B6 50%, #7C00FF 100%)', // Primary gradient
    cardGradient: 'linear-gradient(135deg, rgba(77, 0, 255, 0.1) 0%, rgba(10, 0, 182, 0.1) 100%)', // Subtle card gradient
  },

  // Text colors
  text: {
    primary: '#FFFFFF',      // Main headings
    secondary: '#F5F7FA',    // Body text, labels
    muted: 'rgba(255, 255, 255, 0.9)',  // 90% opacity
    disabled: 'rgba(255, 255, 255, 0.5)', // 50% opacity
    white: '#ffffff',
  },

  // Border & divider
  border: {
    default: '#374151',      // Gray borders
    card: 'rgba(128, 128, 128, 0.3)', // Gray-800 with opacity
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    accent: 'rgba(176, 101, 255, 0.5)', // Purple border
  },

  // Shadows - Purple glow theme
  shadow: {
    soft: '0 8px 30px rgba(0, 0, 0, 0.3)',
    medium: '0 12px 40px rgba(0, 0, 0, 0.4)',
    strong: '0 20px 60px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(162, 89, 255, 0.3)',      // Violet glow
    glowLarge: '0 0 40px rgba(162, 89, 255, 0.4)', // Violet glow large
    cardShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
  },

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Transitions
  transition: {
    fast: '0.15s ease',
    normal: '0.3s ease-out',
    slow: '0.5s ease',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Sidebar specific
  sidebar: {
    width: '240px',
    activeBg: 'linear-gradient(90deg, rgba(176, 101, 255, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)',
    activeGlow: '0 0 15px rgba(176, 101, 255, 0.2)',
    hoverBg: 'rgba(176, 101, 255, 0.1)',
  },

  // Chart colors - Purple theme
  chart: {
    income: '#2dd4bf',       // Teal for income (keeping contrast)
    expense: '#B065FF',      // Purple for expense
    primary: '#B065FF',
    secondary: '#7c3aed',
    tertiary: '#a855f7',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#F5F7FA',
  },

  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#B065FF',        // Purple for info
  },

  // Typography
  font: {
    primary: 'var(--font-inter), Inter, sans-serif',
    secondary: 'var(--font-poppins), Poppins, sans-serif',
  },

  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
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