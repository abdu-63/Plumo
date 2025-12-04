import SeriesCard from '@/components/SeriesCard';
import ContinueWatching from '@/components/ContinueWatching';
import styles from './page.module.css';
import { getAllSeries } from '@/data/series';

export default async function Home({ searchParams }) {
  const { q } = await searchParams;
  const allSeries = getAllSeries();

  const filteredSeries = q
    ? allSeries.filter(s => s.title.toLowerCase().includes(q.toLowerCase()))
    : allSeries;

  return (
    <main>
      <div className="container" style={{ marginTop: '2rem' }}>
        <ContinueWatching />
        <h2 className={styles.sectionTitle}>
          {q ? `Résultats pour "${q}"` : <>Catalogue</>}
        </h2>

        {filteredSeries.length > 0 ? (
          <div className={styles.grid}>
            {filteredSeries.map((series) => (
              <SeriesCard
                key={series.id}
                id={series.id}
                title={series.title}
                year={series.year}
                image={series.image}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Aucun résultat trouvé.</p>
        )}
      </div>
    </main>
  );
}
