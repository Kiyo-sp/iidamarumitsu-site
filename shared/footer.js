/* === SHARED FOOTER -- Iida Marumitsu === */

function SharedFooter() {
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
      React.createElement("p", {
        style: { fontFamily: FONT, fontSize: 11, color: COLOR.textMuted, marginTop: 24 }
      }, "\u00A9 1978-2026 \u682A\u5F0F\u4F1A\u793E\u98EF\u7530\u4E38\u5149\u90E8\u54C1")
    )
  );
}
