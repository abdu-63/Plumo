'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useFavorites() {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (session) {
            // Fetch from API
            fetch('/api/user/favorites')
                .then(res => res.json())
                .then(data => {
                    // Transform IDs to series objects (requires fetching series data or storing full object)
                    // For now, we'll assume we need to map IDs back to series objects from our local data
                    // This is a limitation of mixing local data with DB. 
                    // Ideally, series data should also be in DB or fetched via ID.
                    // We will store just IDs in DB and map them here.
                    // BUT, we don't have access to getAllSeries here easily without importing it.
                    // Let's import it.
                    import('@/data/series').then(({ getAllSeries }) => {
                        const allSeries = getAllSeries();
                        const favs = allSeries.filter(s => data.includes(s.id));
                        setFavorites(favs);
                    });
                });
        } else {
            // Fallback to LocalStorage
            const storedFavorites = localStorage.getItem('plumo_favorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        }
    }, [session]);

    const toggleFavorite = async (series) => {
        if (session) {
            // Optimistic update
            const isFav = favorites.some(f => f.id === series.id);
            let newFavorites;
            if (isFav) {
                newFavorites = favorites.filter(f => f.id !== series.id);
            } else {
                newFavorites = [...favorites, series];
            }
            setFavorites(newFavorites);

            // Sync with API
            await fetch('/api/user/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seriesId: series.id }),
            });
        } else {
            // LocalStorage logic
            const isFavorite = favorites.some(fav => fav.id === series.id);
            let newFavorites;

            if (isFavorite) {
                newFavorites = favorites.filter(fav => fav.id !== series.id);
            } else {
                newFavorites = [...favorites, series];
            }

            setFavorites(newFavorites);
            localStorage.setItem('plumo_favorites', JSON.stringify(newFavorites));
        }
    };

    const isFavorite = (seriesId) => {
        return favorites.some(fav => fav.id === seriesId);
    };

    return { favorites, toggleFavorite, isFavorite };
}
