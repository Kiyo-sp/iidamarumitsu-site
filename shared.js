/* shared.js -- auto-generated */
/* === DESIGN TOKENS -- Iida Marumitsu Buhin === */

var COLOR = {
  bg:          "#ffffff",
  text:        "#1d1d1f",
  textSub:     "#555",
  textMuted:   "#999",
  accent:      "#1a4b8e",
  surface:     "#f9f9f9",
  surfaceAlt:  "#f5f7fa",
  border:      "#e5e5e5",
  borderLight: "rgba(0,0,0,0.06)",
  white:       "#fff"
};

var FONT = "'Noto Sans JP',system-ui,sans-serif";

var MAX_W = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "0 24px"
};


/* === SHARED HOOKS === */

function useScrollY() {
  var _s = useState(0), y = _s[0], setY = _s[1];
  useEffect(function() {
    var h = function() { setY(window.scrollY || window.pageYOffset || 0); };
    window.addEventListener("scroll", h, { passive: true });
    return function() { window.removeEventListener("scroll", h); };
  }, []);
  return y;
}

function useScrolledPast(threshold) {
  if (threshold === undefined) threshold = 300;
  var _s = useState(false), past = _s[0], setPast = _s[1];
  useEffect(function() {
    var h = function() {
      var y = window.scrollY || window.pageYOffset || 0;
      setPast(function(prev) {
        if (prev === (y > threshold)) return prev;
        return y > threshold;
      });
    };
    window.addEventListener("scroll", h, { passive: true });
    return function() { window.removeEventListener("scroll", h); };
  }, [threshold]);
  return past;
}

function useInView(t) {
  if (t === undefined) t = 0.12;
  var ref = useRef(null);
  var _s = useState(false), v = _s[0], setV = _s[1];
  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        setV(true);
        obs.unobserve(el);
      }
    }, { threshold: t });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, [t]);
  return [ref, v];
}

function useWinW() {
  var _s = useState(typeof window !== "undefined" ? window.innerWidth : 1200), w = _s[0], setW = _s[1];
  useEffect(function() {
    var h = function() { setW(window.innerWidth); };
    window.addEventListener("resize", h);
    return function() { window.removeEventListener("resize", h); };
  }, []);
  return w;
}


/* === SHARED UI PRIMITIVES === */

function Reveal(props) {
  var children = props.children;
  var delay = props.delay || 0;
  var direction = props.direction || "up";
  var style = props.style || {};
  var _iv = useInView(0.06), ref = _iv[0], inView = _iv[1];
  var t = { up: "translateY(40px)", left: "translateX(40px)", scale: "scale(0.95)" };
  return React.createElement("div", {
    ref: ref,
    style: Object.assign({
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : (t[direction] || t.up),
      transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) " + delay + "s, transform 0.8s cubic-bezier(0.16,1,0.3,1) " + delay + "s"
    }, style)
  }, children);
}

function SectionLabel(props) {
  var color = props.color || COLOR.textMuted;
  return React.createElement("p", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      color: color,
      letterSpacing: 3,
      marginBottom: 12,
      textTransform: "uppercase"
    }
  }, props.children);
}

function SectionTitle(props) {
  var sub = props.sub;
  return React.createElement(React.Fragment, null,
    React.createElement("h2", {
      style: {
        fontFamily: FONT,
        fontSize: "clamp(24px,4.5vw,40px)",
        fontWeight: 900,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        marginBottom: sub ? 16 : 0
      }
    }, props.children),
    sub && React.createElement("p", {
      style: {
        fontFamily: FONT,
        fontSize: "clamp(14px,1.8vw,17px)",
        color: COLOR.textSub,
        lineHeight: 1.8,
        maxWidth: 600,
        margin: "0 auto"
      }
    }, sub)
  );
}


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


/* === SHARED FOOTER -- Iida Marumitsu === */

function SharedFooter() {
  var groups = [
    { name: "SPREAD", href: "https://spread-inc.co.jp/" },
    { name: "\u30A4\u30FC\u30FB\u30A8\u30CC\u30FB\u30C9\u30A5", href: "https://e-n-do.com/" },
    { name: "\u9580\u7530\u5546\u5E97", href: "https://kadota-works.co.jp/" }
  ];

  return React.createElement("footer", {
    style: {
      padding: "48px 24px 32px",
      borderTop: "1px solid " + COLOR.border,
      background: COLOR.surfaceAlt
    }
  },
    React.createElement("div", {
      style: { maxWidth: 980, margin: "0 auto", textAlign: "center" }
    },
      React.createElement("p", {
        style: { fontFamily: FONT, fontSize: 15, fontWeight: 900, color: COLOR.text, marginBottom: 16, letterSpacing: 1 }
      }, "\u682A\u5F0F\u4F1A\u793E\u98EF\u7530\u4E38\u5149\u90E8\u54C1"),
      React.createElement("p", {
        style: { fontFamily: FONT, fontSize: 13, color: COLOR.textSub, lineHeight: 2 }
      },
        "\u3012395-0053 \u9577\u91CE\u770C\u98EF\u7530\u5E02\u5927\u4E45\u4FDD\u753A2565-6",
        React.createElement("br"),
        "TEL: 0265-23-1231"
      ),

      /* Divider */
      React.createElement("div", {
        style: { width: "100%", height: 1, background: COLOR.border, margin: "24px 0" }
      }),

      /* Group companies */
      React.createElement("p", {
        style: { fontFamily: FONT, fontSize: 11, color: COLOR.textMuted, letterSpacing: 2, marginBottom: 12 }
      }, "GROUP"),
      React.createElement("div", {
        style: { display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 24 }
      },
        groups.map(function(g, i) {
          return React.createElement("a", {
            key: i,
            href: g.href,
            target: "_blank",
            rel: "noopener",
            style: { fontFamily: FONT, fontSize: 12, color: COLOR.textSub, textDecoration: "none" }
          }, g.name);
        })
      ),

      React.createElement("p", {
        style: { fontFamily: FONT, fontSize: 11, color: COLOR.textMuted, marginTop: 8 }
      }, "\u00A9 1978-2026 \u682A\u5F0F\u4F1A\u793E\u98EF\u7530\u4E38\u5149\u90E8\u54C1")
    )
  );
}

