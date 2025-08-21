"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AnimationContextType {
	cursorPosition: { x: number, y: number };
	scrollProgress: number;
	isDarkMode: boolean;
	isReducedMotion: boolean;
	scrollTriggerReady: boolean;
	createScrollAnimation: (config: any) => any;
	scrollTo: (target: string | number | HTMLElement, options?: any) => void;
}

const AnimationContext = createContext<AnimationContextType>({
	cursorPosition: { x: 0, y: 0 },
	scrollProgress: 0,
	isDarkMode: false,
	isReducedMotion: false,
	scrollTriggerReady: false,
	createScrollAnimation: () => null,
	scrollTo: () => {}
});

export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
	children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
	return (
		<AnimationProviderInner>
			{children}
		</AnimationProviderInner>
	);
};

const AnimationProviderInner: React.FC<AnimationProviderProps> = ({ children }) => {
	// Minimal state
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [scrollProgress, setScrollProgress] = useState(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isReducedMotion, setIsReducedMotion] = useState(false);

	// Reduced motion detection
	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		setIsReducedMotion(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);

	// Lightweight scroll progress tracker
	useEffect(() => {
		let raf: number | null = null;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				const top = window.scrollY;
				const h = Math.max(1, document.body.offsetHeight - window.innerHeight);
				setScrollProgress(top / h);
				raf = null;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	// Lightweight cursor tracker (throttled)
	useEffect(() => {
		let raf: number | null = null;
		const onMove = (e: MouseEvent) => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				setCursorPosition({ x: e.clientX, y: e.clientY });
				raf = null;
			});
		};
		window.addEventListener('mousemove', onMove, { passive: true });
		return () => window.removeEventListener('mousemove', onMove);
	}, []);

	const contextValue = useMemo(
		() => ({
			cursorPosition,
			scrollProgress,
			isDarkMode,
			isReducedMotion,
			scrollTriggerReady: false,
			createScrollAnimation: () => null,
			scrollTo: () => {}
		}),
		[cursorPosition, scrollProgress, isDarkMode, isReducedMotion]
	);

	return (
		<AnimationContext.Provider value={contextValue}>
			{children}
		</AnimationContext.Provider>
	);
};

export default AnimationProvider;
