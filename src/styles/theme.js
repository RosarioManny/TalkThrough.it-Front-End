// src/styles/theme.js
export const theme = {
  layout: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-12 md:py-20",
    wrapper: "min-h-screen bg-alice_blue-500",
  },

  button: {
    primary: "bg-celestial_blue-500 hover:bg-celestial_blue-600 text-white transition-all duration-200",
    secondary: "bg-prussian_blue-500 hover:bg-prussian_blue-600 text-white transition-all duration-200",
    outline: "border-2 border-celestial_blue-500 text-celestial_blue-500 hover:bg-celestial_blue-50 transition-all duration-200",
    ghost: "text-celestial_blue-500 hover:bg-celestial_blue-50 transition-all duration-200",
  },

  card: {
    default: "bg-white border border-alice_blue-300 rounded-lg shadow-md",
    hover: "transition-all duration-200 hover:shadow-lg",
    active: "border-celestial_blue-500",
  },

  text: {
    heading: "font-bold text-prussian_blue-500",
    body: "text-prussian_blue-400",
    link: "text-celestial_blue-500 hover:text-celestial_blue-600 transition-all duration-200",
    nav: "text-alice_blue-500 hover:text-celestial_blue-300 transition-all duration-200",
  },

  nav: {
    wrapper: "bg-prussian_blue-500 p-4 shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95",
    dropdown: "absolute top-full right-0 w-48 pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2",
    dropdownItem: "block w-full text-left px-4 py-2 text-prussian_blue-500 hover:bg-celestial_blue-50 transition-colors",
  },

  status: {
    success: "bg-celadon-100 text-celadon-700 border border-celadon-200",
    warning: "bg-sunglow-100 text-sunglow-700 border border-sunglow-200",
    error: "bg-red-100 text-red-700 border border-red-200",
    info: "bg-celestial_blue-100 text-celestial_blue-700 border border-celestial_blue-200",
  },

  badges: {
    verified: "bg-celadon-100 text-celadon-700 px-2 py-1 rounded-full text-sm font-medium",
    featured: "bg-sunglow-100 text-sunglow-700 px-2 py-1 rounded-full text-sm font-medium",
    new: "bg-celestial_blue-100 text-celestial_blue-700 px-2 py-1 rounded-full text-sm font-medium",
  },
};