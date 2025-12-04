'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ series }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(series.id);

    return (
        <button
            className={styles.button}
            onClick={() => toggleFavorite(series)}
            title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
            <Heart
                size={24}
                fill={favorite ? "var(--accent)" : "none"}
                color={favorite ? "var(--accent)" : "white"}
            />
        </button>
    );
}
