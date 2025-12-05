'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useWatchHistory() {
    const { data: session, status } = useSession();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (status === 'loading') return;

        if (session) {
            // 1. Sync Logic: Always check if we have local data to migrate
            const storedHistory = localStorage.getItem('plumo_history');

            if (storedHistory) {
                const localData = JSON.parse(storedHistory);
                if (localData && localData.length > 0) {
                    console.log('Migrating local history to server...');

                    // Upload each item in background
                    // We reverse to keep chronological order if we were appending, 
                    // though typically 'lastWatchedAt' timestamp handles sorting.
                    (async () => {
                        for (const item of localData.reverse()) {
                            await fetch('/api/user/history', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    seriesId: item.seriesId,
                                    seriesTitle: item.seriesTitle,
                                    seriesImage: item.seriesImage,
                                    episodeId: item.episodeId,
                                    episodeTitle: item.episodeTitle,
                                    episodeImage: item.episodeImage,
                                    position: item.lastPosition,
                                    seasonIndex: item.seasonIndex
                                }),
                            });
                        }
                        // 2. Clear local storage after migration
                        console.log('Migration complete. Clearing local storage.');
                        localStorage.removeItem('plumo_history');

                        // 3. Fetch final server state
                        fetch('/api/user/history')
                            .then(res => res.json())
                            .then(data => setHistory(data));
                    })();

                    // Show local data optimistically while syncing/fetching? 
                    // Or just wait? Better to show merged server data to be sure.
                    // But to avoid "empty" flash, we can setHistory(localData) tentatively.
                    // However, safe bet is just fetch.
                } else {
                    // Local storage empty, just fetch
                    fetch('/api/user/history')
                        .then(res => res.json())
                        .then(data => setHistory(data));
                }
            } else {
                // No local data, standard fetch
                fetch('/api/user/history')
                    .then(res => res.json())
                    .then(data => setHistory(data));
            }
        } else {
            const storedHistory = localStorage.getItem('plumo_history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        }
    }, [session, status]);

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
