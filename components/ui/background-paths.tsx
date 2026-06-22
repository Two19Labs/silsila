"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PathConfig {
    id: string | number;
    d: string;
    width: number;
    opacity: number;
}

// Custom mountain ridge path generator
const generateMountainPaths = (
    basePathFn: (offset: number) => string,
    prefixId: string,
    count: number,
    spacing: number
): PathConfig[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${prefixId}-${i}`,
        d: basePathFn(i * spacing),
        width: 0.5 + (count - i) * 0.05,
        opacity: 0.08 + (count - i) * 0.02,
    }));
};

export function BackgroundPaths({
    title = "Silsila",
    subtitle = "A space for slow coffee and quiet work.",
    description = "Silsila is a quiet neighborhood café and gallery in Haldwani. We serve single-origin filter coffee, custom baked items, and a curated selection of home textiles and pottery.",
}: {
    title?: string;
    subtitle?: string;
    description?: string;
}) {
    // 1. Mountain Ridges (Topographic line layers)
    const farMountains = generateMountainPaths(
        (offset) => `M -100 ${240 + offset} Q 250 ${120 + offset * 0.8}, 550 ${260 + offset} T 1200 ${160 + offset * 0.8}`,
        "far-mount",
        6,
        15
    );

    const midMountains = generateMountainPaths(
        (offset) => `M -100 ${360 + offset} Q 350 ${200 + offset * 0.8}, 750 ${380 + offset} T 1200 ${280 + offset * 0.8}`,
        "mid-mount",
        6,
        15
    );

    const nearMountains = generateMountainPaths(
        (offset) => `M -100 ${480 + offset} Q 450 ${320 + offset * 0.8}, 850 ${500 + offset} T 1200 ${400 + offset * 0.8}`,
        "near-mount",
        6,
        15
    );

    // 2. Flowing Water Streams (emerging from mountain valleys and winding down)
    // We generate multiple parallel lines for each water stream channel
    const generateStreamPaths = (
        basePathFn: (offset: number) => string,
        prefixId: string,
        count: number,
        spacing: number
    ): PathConfig[] => {
        return Array.from({ length: count }, (_, i) => ({
            id: `${prefixId}-${i}`,
            d: basePathFn(i * spacing),
            width: 0.6 + i * 0.1,
            opacity: 0.12 + i * 0.02,
        }));
    };

    // Main stream winding down
    const mainStream = generateStreamPaths(
        (offset) => `M ${550 + offset} 240 C ${510 + offset} 360, ${680 + offset} 520, ${620 + offset} 660 C ${560 + offset} 780, ${680 + offset} 850, ${650 + offset} 950`,
        "main-stream",
        5,
        6
    );

    // Tributary stream branching left
    const leftBranch = generateStreamPaths(
        (offset) => `M ${620 + offset} 660 C ${560 + offset} 740, ${440 + offset} 820, ${380 + offset} 950`,
        "left-stream",
        4,
        5
    );

    // Tributary stream branching right
    const rightBranch = generateStreamPaths(
        (offset) => `M ${620 + offset} 660 C ${680 + offset} 750, ${820 + offset} 830, ${900 + offset} 950`,
        "right-stream",
        4,
        5
    );

    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-stone-50 dark:bg-neutral-950 transition-colors duration-500">
            {/* Background SVG lines */}
            <div class="absolute inset-0 pointer-events-none">
                <svg
                    className="w-full h-full text-stone-900/10 dark:text-stone-100/10"
                    viewBox="0 0 1100 800"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                >
                    <title>Silsila Mountains &amp; Water Streams</title>

                    {/* --- MOUNTAINS (Forming effect on load) --- */}
                    {[...farMountains, ...midMountains, ...nearMountains].map((path) => (
                        <motion.path
                            key={path.id}
                            d={path.d}
                            stroke="currentColor"
                            strokeWidth={path.width}
                            strokeOpacity={path.opacity}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: path.opacity,
                                y: [0, -3, 0], // Gentle breathing motion
                            }}
                            transition={{
                                pathLength: { duration: 4 + Math.random() * 3, ease: "easeInOut" },
                                opacity: { duration: 2 },
                                y: {
                                    duration: 12 + Math.random() * 8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                },
                            }}
                        />
                    ))}

                    {/* --- WATER STREAMS (Continuous flowing effect) --- */}
                    {[...mainStream, ...leftBranch, ...rightBranch].map((path) => (
                        <motion.path
                            key={path.id}
                            d={path.d}
                            stroke="currentColor"
                            strokeWidth={path.width}
                            strokeOpacity={path.opacity}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: path.opacity,
                                strokeDashoffset: [0, -100], // Simulates water flow along the path
                            }}
                            transition={{
                                pathLength: { duration: 3 + Math.random() * 2, ease: "easeOut" },
                                opacity: { duration: 1.5 },
                                strokeDashoffset: {
                                    duration: 8 + Math.random() * 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                },
                            }}
                            style={{
                                strokeDasharray: "15 35", // Clean spacing for the flowing dash effect
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    {/* EST. HALDWANI meta */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="text-xs tracking-[0.25em] uppercase font-medium text-stone-500 dark:text-stone-400 mb-4"
                    >
                        EST. HALDWANI
                    </motion.div>

                    {/* Main Title "Silsila" with Spring Letter reveal */}
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight mb-6">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0 font-serif italic font-normal"
                                style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 80, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: wordIndex * 0.1 + letterIndex * 0.04,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 22,
                                        }}
                                        className="inline-block text-stone-900 dark:text-stone-100"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="text-xl sm:text-2xl font-serif italic text-stone-700 dark:text-stone-300 max-w-2xl mb-6 font-light"
                        style={{ fontFamily: "Cormorant Garamond, Georgia, serif" }}
                    >
                        {subtitle}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl mb-10 leading-relaxed font-light"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        {description}
                    </motion.p>

                    {/* Buttons (Primary and Secondary matching brand style) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button
                            variant="default"
                            className="rounded-full px-8 py-6 text-sm tracking-wider uppercase font-medium bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Visit Silsila
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-full px-8 py-6 text-sm tracking-wider uppercase font-medium border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 dark:border-stone-700 dark:hover:border-stone-300 dark:text-stone-300 dark:hover:text-stone-100 bg-transparent transition-all duration-300"
                        >
                            Our Story
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
