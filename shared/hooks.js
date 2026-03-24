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
