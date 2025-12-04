'use client';

import { useWatchHistory } from '@/hooks/useWatchHistory';
import Link from 'next/link';
import { Play } from 'lucide-react';
import styles from './ContinueWatching.module.css';
import { seriesData } from '@/data/series';

export default function ContinueWatching() {
    const { history } = useWatchHistory();

    if (history.length === 0) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Reprendre la lecture</h2>
            <div className={styles.grid}>
                {history.map((item) => {
                    // Lookup fresh data to ensure we have the latest image
                    const series = seriesData[item.seriesId];
                    let freshEpisodeImage = item.episodeImage;

                    if (series) {
                        // Try to find the episode in seasons
                        if (series.seasons) {
                            for (const season of series.seasons) {
                                const ep = season.episodes.find(e => e.id == item.episodeId);
                                if (ep && ep.image) {
                                    freshEpisodeImage = ep.image;
                                    break;
                                }
                            }
                        }
                        // Try to find in flat episodes list
                        if (!freshEpisodeImage && series.episodes) {
                            const ep = series.episodes.find(e => e.id == item.episodeId);
                            if (ep && ep.image) {
                                freshEpisodeImage = ep.image;
                            }
                        }
                    }

                    // Fallback to series image if episode image is missing or invalid
                    const displayImage = (freshEpisodeImage && freshEpisodeImage.length > 15 && !freshEpisodeImage.endsWith('/'))
                        ? freshEpisodeImage
                        : (series?.image || item.seriesImage);

                    return (
                        <Link
                            key={`${item.seriesId}-${item.episodeId}`}
                            href={`/productions/${item.seriesId}?episode=${item.episodeId}&t=${item.lastPosition}${typeof item.seasonIndex !== 'undefined' ? `&season=${item.seasonIndex}` : ''}`}
                            className={styles.card}
                        >
                            <div className={styles.imageContainer}>
                                <div
                                    className={styles.image}
                                    style={{
                                        backgroundImage: `url("${encodeURI(displayImage)}")`
                                    }}
                                />
                                <div className={styles.overlay}>
                                    <Play size={24} fill="white" />
                                </div>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.seriesTitle}>{item.seriesTitle}</div>
                                <div className={styles.episodeTitle}>{item.episodeTitle}</div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
