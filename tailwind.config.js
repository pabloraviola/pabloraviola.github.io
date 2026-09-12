module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        // Short viewports (typical laptop with browser chrome) - compact typography
        short: { raw: "(max-height: 790px)" },
      },
    },
  },
  plugins: [],
};
