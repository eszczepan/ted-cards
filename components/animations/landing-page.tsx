"use client";

import { motion, useInView, Variants, TargetAndTransition } from "framer-motion";
import { useRef, ReactNode } from "react";

type AnimationProps = {
  children: ReactNode;
  delay?: number;
  once?: boolean;
  amount?: number;
};

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const rotateIn = {
  hidden: { opacity: 0, rotate: 15, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
};

export function AnimatedHeading({ children, delay = 0, once = true, amount = 0.3 }: AnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedContainer({ children, delay = 0, once = true, amount = 0.1 }: AnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCards({ children, once = true, amount = 0.1 }: Omit<AnimationProps, "delay">) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type AnimatedCardProps = AnimationProps & {
  direction?: "left" | "right" | "up" | "down";
  scale?: boolean;
  rotate?: number;
};

export function AnimatedCard({ children, delay = 0, direction = "up", scale = false, rotate = 0 }: AnimatedCardProps) {
  const getVariants = (): Variants => {
    const hidden: TargetAndTransition = {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
    };

    const visible: TargetAndTransition = {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay,
      },
    };

    if (scale) {
      hidden.scale = 0.9;
      visible.scale = 1;
    }

    if (rotate !== 0) {
      hidden.rotate = rotate;
      visible.rotate = 0;
    }

    return {
      hidden,
      visible,
    };
  };

  return <motion.div variants={getVariants()}>{children}</motion.div>;
}

export function AnimatedFlashcard({ children, delay = 0, rotate = 0 }: Omit<AnimatedCardProps, "direction" | "scale">) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        rotate: rotate || 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate ? rotate / 2 : 0,
        scale: 1,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, delay = 0.3 }: Omit<AnimationProps, "once" | "amount">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedIcon({
  children,
  delay = 0,
  scale = true,
  rotate = 0,
}: Omit<AnimatedCardProps, "direction" | "once" | "amount">) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: scale ? 0.8 : 1,
        rotate: rotate,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotate ? rotate / 2 : 0,
      }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
