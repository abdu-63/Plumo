'use client';

import { useFavorites } from '@/hooks/useFavorites';
import SeriesCard from '@/components/SeriesCard';
import styles from '../page.module.css';

export default function FavoritesPage() {
    const { favorites } = useFavorites();

    return (
        <main className={styles.main}>
            <div className="container">
                <h1 className={styles.sectionTitle}>Mes Favoris</h1>

                {favorites.length > 0 ? (
                    <div className={styles.grid}>
                        {favorites.map((series) => (
                            <SeriesCard
                                key={series.id}
                                id={series.id}
                                title={series.title}
                                image={series.image}
                                year={series.year}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 0',
                        color: '#888',
                        fontSize: '1.2rem'
                    }}>
                        Vous n'avez aucun favori pour le moment.
                    </div>
                )}
            </div>
        </main>
    );
}
