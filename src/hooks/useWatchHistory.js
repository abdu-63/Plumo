'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useWatchHistory() {
    const { data: session } = useSession();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (session) {
            fetch('/api/user/history')
                .then(res => res.json())
                .then(data => setHistory(data));
        } else {
            const storedHistory = localStorage.getItem('plumo_history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        }
    }, [session]);

    const addToHistory = async (series, episode, position = undefined, seasonIndex = undefined) => {
        if (session) {
            // Optimistic update
            const newEntry = {
                seriesId: series.id,
                seriesTitle: series.title,
                seriesImage: series.image,
                episodeId: episode.id,
                episodeTitle: episode.title,
                episodeImage: episode.image,
                lastWatchedAt: new Date().toISOString(),
                ...(typeof position === 'number' ? { lastPosition: position } : {}),
                ...(typeof seasonIndex === 'number' ? { seasonIndex } : {})
            };
            const filteredHistory = history.filter(h => !(h.seriesId === series.id && h.episodeId === episode.id));
            const newHistory = [newEntry, ...filteredHistory].slice(0, 10);
            setHistory(newHistory);

            await fetch('/api/user/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seriesId: series.id,
                    seriesTitle: series.title,
                    seriesImage: series.image,
                    episodeId: episode.id,
                    episodeTitle: episode.title,
                    episodeImage: episode.image,
                    // optional playback position in seconds
                    position: typeof position === 'number' ? position : undefined,
                    seasonIndex: typeof seasonIndex === 'number' ? seasonIndex : undefined
                }),
            });
        } else {
            const newEntry = {
                seriesId: series.id,
                seriesTitle: series.title,
                seriesImage: series.image,
                episodeId: episode.id,
                episodeTitle: episode.title,
                episodeImage: episode.image,
                lastWatchedAt: new Date().toISOString(),
            };

            if (typeof position === 'number') {
                newEntry.lastPosition = position;
            }

            if (typeof seasonIndex === 'number') {
                newEntry.seasonIndex = seasonIndex;
            }

            const filteredHistory = history.filter(h => h.seriesId !== series.id);
            const newHistory = [newEntry, ...filteredHistory].slice(0, 10);

            setHistory(newHistory);
            localStorage.setItem('plumo_history', JSON.stringify(newHistory));
        }
    };

    return { history, addToHistory };
}
