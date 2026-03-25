/* === SHARED FOOTER -- Iida Marumitsu === */

function SharedFooter() {
  var groups = [
    { name: "\u682A\u5F0F\u4F1A\u793ESPREAD", href: "https://spread-inc.co.jp/" },
    { name: "\u30A4\u30FC\u30FB\u30A8\u30CC\u30FB\u30C9\u30A5", href: "https://e-n-do.com/" },
    { name: "\u9580\u7530\u5DE5\u696D", href: "https://kadota-works.co.jp/" }
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
