/* === SHARED NAVIGATION -- Iida Marumitsu === */

function SharedNav() {
  var scrolled = useScrolledPast(60);
  var w = useWinW();
  var isMobile = w < 768;

  return React.createElement("nav", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid " + (scrolled ? COLOR.border : "transparent"),
      padding: "0 24px",
      transition: "background 0.3s, border-color 0.3s"
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
          fontFamily: FONT,
          fontSize: isMobile ? 14 : 16,
          fontWeight: 900,
          color: COLOR.text,
          textDecoration: "none",
          letterSpacing: 1
        }
      }, "\u98EF\u7530\u4E38\u5149\u90E8\u54C1"),

      /* Phone */
      React.createElement("a", {
        href: "tel:0265-23-1231",
        style: {
          fontFamily: FONT,
          fontSize: isMobile ? 12 : 13,
          fontWeight: 700,
          color: COLOR.accent,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6
        }
      },
        React.createElement("span", { style: { fontSize: 15 } }, "\u260E"),
        "0265-23-1231"
      )
    )
  );
}
