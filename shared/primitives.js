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
