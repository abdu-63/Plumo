import { notFound } from 'next/navigation';
import { getSeriesById } from '@/data/series';
import EpisodeList from '@/components/EpisodeList';
import SeriesHero from '@/components/SeriesHero';
import styles from './page.module.css';

export default async function SeriesPage({ params, searchParams }) {
    const { id } = await params;
    const { episode, t, season } = await searchParams;
    const series = getSeriesById(id);

    if (!series) {
        notFound();
    }

    const initialEpisodeId = episode ? parseInt(episode) : null;
    const initialTimestamp = t || null;
    const initialSeasonIndex = season ? parseInt(season) : undefined;

    return (
        <div className={styles.container}>
            <SeriesHero series={series} />

            <div className={styles.episodesSection}>
                <EpisodeList
                    episodes={series.episodes}
                    series={series}
                    seasons={series.seasons}
                    initialEpisodeId={initialEpisodeId}
                    initialTimestamp={initialTimestamp}
                    initialSeasonIndex={initialSeasonIndex}
                />
            </div>
        </div>
    );
}
