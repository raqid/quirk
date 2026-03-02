import React from 'react';

const motion = new Proxy({} as Record<string, React.ElementType>, {
  get: (_target, prop: string) => {
    return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      const {
        children,
        initial,
        animate,
        whileInView,
        transition,
        viewport,
        variants,
        whileHover,
        whileTap,
        ...rest
      } = props;
      return React.createElement(prop, { ...rest, ref }, children as React.ReactNode);
    });
  },
});

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const useInView = () => true;
const useAnimation = () => ({ start: vi.fn(), stop: vi.fn() });
const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} });
const useTransform = () => 0;
const useSpring = () => ({ get: () => 0, set: () => {} });

export { motion, AnimatePresence, useInView, useAnimation, useMotionValue, useTransform, useSpring };
