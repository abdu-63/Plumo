const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvFilePath = path.join(__dirname, '../kai.csv');
const outputFilePath = path.join(__dirname, '../src/data/series.js');

const csvFileContent = fs.readFileSync(csvFilePath, 'utf8');

Papa.parse(csvFileContent, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        const seriesData = {};

        const seriesImages = fs.readdirSync(path.join(__dirname, '../public/images'))
            .filter(file => !file.startsWith('.'));
        const backgroundImages = fs.readdirSync(path.join(__dirname, '../public/background'))
            .filter(file => !file.startsWith('.'));

        results.data.forEach((row, index) => {
            const seriesName = row['Nom'];
            const seriesId = seriesName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            if (!seriesData[seriesId]) {
                // Try to find a matching image in public/images
                // Priority: Exact match > Starts with
                const normalizedTitle = seriesName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                let matchingImage = seriesImages.find(img => {
                    const normalizedImg = img.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    return normalizedImg === normalizedTitle;
                });

                if (!matchingImage) {
                    matchingImage = seriesImages.find(img => {
                        const normalizedImg = img.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        return normalizedImg.startsWith(normalizedTitle);
                    });
                }

                // Try to find a matching background image
                // Convention seems to be series_name_background.png
                let matchingBackground = backgroundImages.find(bg => {
                    const normalizedBg = bg.replace(/_background\.[^/.]+$/, "").replace(/_/g, '').toLowerCase();
                    return normalizedBg === normalizedTitle;
                });

                if (!matchingBackground) {
                    matchingBackground = backgroundImages.find(bg => {
                        const normalizedBg = bg.replace(/_background\.[^/.]+$/, "").replace(/_/g, '').toLowerCase();
                        return normalizedBg.includes(normalizedTitle) || normalizedTitle.includes(normalizedBg);
                    });
                }

                let seriesImage = `/vignettes/${row['Nom Fichier Image']}`; // Default fallback
                if (matchingImage) {
                    seriesImage = `/images/${matchingImage}`;
                }

                let backgroundImage = null;
                if (matchingBackground) {
                    backgroundImage = `/background/${matchingBackground}`;
                }

                seriesData[seriesId] = {
                    id: seriesId,
                    title: seriesName,
                    year: "2000", // Default year as it's not in CSV
                    synopsis: row['Description synopsis'],
                    tags: [],
                    image: seriesImage,
                    backgroundImage: backgroundImage,
                    seasons: [],
                    torrents: []
                };
            }

            const seasonName = row['Nom Saison'];
            let season = seriesData[seriesId].seasons.find(s => s.name === seasonName);

            if (!season) {
                season = {
                    name: seasonName,
                    episodes: []
                };
                seriesData[seriesId].seasons.push(season);
            }

            season.episodes.push({
                id: season.episodes.length + 1,
                title: row['Titre Épisode'],
                description: row['Description Épisode'],
                duration: row['Durée'],
                episodesInclus: row['Épisodes Inclus'],
                image: `/vignettes/${row['Nom Fichier Image']}`,
                videoUrl: "" // Placeholder
            });
        });

        // Sort series by title
        const sortedSeriesData = Object.keys(seriesData)
            .sort((a, b) => seriesData[a].title.localeCompare(seriesData[b].title))
            .reduce((acc, key) => {
                acc[key] = seriesData[key];
                return acc;
            }, {});

        const fileContent = `export const seriesData = ${JSON.stringify(sortedSeriesData, null, 4)};

export const getAllSeries = () => Object.values(seriesData);

export const getSeriesById = (id) => seriesData[id];
`;

        fs.writeFileSync(outputFilePath, fileContent);
        console.log(`Successfully wrote series data to ${outputFilePath}`);
    }
});
