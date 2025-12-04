'use client';

import { useWatchHistory } from '@/hooks/useWatchHistory';
import Link from 'next/link';
import { Play } from 'lucide-react';
import styles from './ContinueWatching.module.css';

export default function ContinueWatching() {
    const { history } = useWatchHistory();

    if (history.length === 0) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Reprendre la lecture</h2>
            <div className={styles.grid}>
                {history.map((item) => (
                    <Link
                        key={`${item.seriesId}-${item.episodeId}`}
                        href={`/productions/${item.seriesId}?episode=${item.episodeId}&t=${item.lastPosition}${typeof item.seasonIndex !== 'undefined' ? `&season=${item.seasonIndex}` : ''}`}
                        className={styles.card}
                    >
                        <div className={styles.imageContainer}>
                            <div
                                className={styles.image}
                                style={{
                                    backgroundImage: `url(${(item.episodeImage && item.episodeImage.length > 15 && !item.episodeImage.endsWith('/'))
                                            ? item.episodeImage
                                            : item.seriesImage
                                        })`
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
                ))}
            </div>
        </div>
    );
}
