/* === SHARED NAVIGATION -- Iida Marumitsu === */

function SharedNav() {
  var scrolled = useScrolledPast(80);
  var w = useWinW();
  var isMobile = w < 768;

  return React.createElement("nav", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(12,24,41,0.6)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: scrolled ? "1px solid #e5e5e5" : "1px solid rgba(255,255,255,0.08)",
      padding: "0 24px",
      transition: "all 0.4s ease"
    }
  },
    React.createElement("div", {
      style: {
        maxWidth: 980,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 56
      }
    },
      /* Company name */
      React.createElement("a", {
        href: "#",
        onClick: function(e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); },
        style: {
          fontFamily: "'Noto Sans JP',system-ui,sans-serif",
          fontSize: isMobile ? 14 : 16,
          fontWeight: 900,
          color: scrolled ? "#1d1d1f" : "#fff",
          textDecoration: "none",
          letterSpacing: 2,
          transition: "color 0.4s"
        }
      }, "\u98EF\u7530\u4E38\u5149\u90E8\u54C1"),

      /* Phone */
      React.createElement("a", {
        href: "tel:0265-23-1231",
        style: {
          fontFamily: "'Noto Sans JP',system-ui,sans-serif",
          fontSize: isMobile ? 12 : 13,
          fontWeight: 700,
          color: scrolled ? "#1a4b8e" : "#c8a84e",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "color 0.4s"
        }
      },
        React.createElement("span", { style: { fontSize: 15 } }, "\u260E"),
        "0265-23-1231"
      )
    )
  );
}
