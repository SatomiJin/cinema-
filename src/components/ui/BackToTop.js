import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./BackToTop.scss";

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 480);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          aria-label={t("backToTop")}
          className="back-to-top"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 8 }}
          onClick={handleClick}
          type="button"
        >
          <ArrowUp aria-hidden="true" size={20} strokeWidth={2.2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export default BackToTop;
