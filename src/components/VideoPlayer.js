'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import styles from './VideoPlayer.module.css';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export default function VideoPlayer({ src, title, series, episode, initialTimestamp, poster }) {
    const playerRef = useRef(null);
    const lastSaveTimeRef = useRef(0);
    const { addToHistory } = useWatchHistory();

    const plyrProps = useMemo(() => ({
        source: {
            type: 'video',
            title: title,
            poster: poster,
            sources: [
                {
                    src: src,
                    type: 'video/mp4',
                },
            ],
        },
        options: {
            autoplay: false, // We handle autoplay manually to avoid conflicts with seeking
            controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'mute',
                'volume',
                'settings',
                'pip',
                'airplay',
                'fullscreen',
            ],
        },
    }), [src, title, poster]);

    // Handle initial timestamp and autoplay
    useEffect(() => {
        const player = playerRef.current?.plyr;
        if (player) {
            const handleReady = () => {
                try {
                    if (initialTimestamp) {
                        // Only seek if we are significantly far from the target time
                        if (Math.abs(player.currentTime - parseFloat(initialTimestamp)) > 1) {
                            player.currentTime = parseFloat(initialTimestamp);
                        }
                    }

                    // Always try to play (autoplay behavior)
                    if (typeof player.play === 'function') {
                        const playPromise = player.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log("Auto-play prevented:", error);
                            });
                        }
                    }
                } catch (e) {
                    console.error("Error seeking/playing:", e);
                }
            };

            // If player is already ready (duration is available), run immediately
            if (player.duration > 0) {
                handleReady();
            } else if (typeof player.on === 'function') {
                player.once('ready', handleReady);
                player.once('loadedmetadata', handleReady);
            } else if (typeof player.addEventListener === 'function') {
                player.addEventListener('loadedmetadata', handleReady, { once: true });
            }
        }
    }, [initialTimestamp, src]); // Re-run if src changes

    // Save position every 10 seconds or on pause
    useEffect(() => {
        const player = playerRef.current?.plyr;
        if (!player || !series || !episode || typeof player.on !== 'function') return;

        const handleTimeUpdate = () => {
            const now = Date.now();
            const position = Math.floor(player.currentTime);

            // Throttle saves to every 10 seconds
            if (now - lastSaveTimeRef.current > 10000) {
                addToHistory(series, episode, position);
                lastSaveTimeRef.current = now;
            }
        };

        const handlePause = () => {
            const position = Math.floor(player.currentTime);
            addToHistory(series, episode, position);
            lastSaveTimeRef.current = Date.now();
        };

        player.on('timeupdate', handleTimeUpdate);
        player.on('pause', handlePause);

        return () => {
            if (typeof player.off === 'function') {
                player.off('timeupdate', handleTimeUpdate);
                player.off('pause', handlePause);
            }
        };
    }, [series, episode, addToHistory]);

    return (
        <div className={styles.container}>
            <div className={styles.videoWrapper} key={`${src}-${poster}`}>
                <Plyr {...plyrProps} ref={playerRef} />
            </div>
        </div>
    );
}
