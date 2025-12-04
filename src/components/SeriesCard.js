import Link from 'next/link';
import styles from './SeriesCard.module.css';

export default function SeriesCard({ id, title, image, year }) {
    return (
        <Link href={`/productions/${id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {/* Placeholder image if no image provided */}
                <div
                    className={styles.image}
                    style={{
                        backgroundColor: '#2a2a2a',
                        backgroundImage: image ? `url(${image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <div className={styles.overlay}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.meta}>{year}</span>
                </div>
            </div>
        </Link>
    );
}
