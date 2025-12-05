const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local NOT FOUND');
    process.exit(1);
}

try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('✅ .env.local found. Size:', content.length, 'bytes');

    const lines = content.split('\n');
    let found = false;

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('NEXT_PUBLIC_FIREBASE_PROJECT_ID=')) {
            found = true;
            const value = trimmed.split('=')[1];
            console.log(`✅ Found NEXT_PUBLIC_FIREBASE_PROJECT_ID on line ${index + 1}`);
            console.log(`   Value length: ${value ? value.length : 0}`);
            console.log(`   Value: "${value}"`); // Safe to print public ID

            if (!value || value.length === 0) {
                console.error('❌ Value is empty!');
            } else if (value.includes('"') || value.includes("'")) {
                console.warn('⚠️ Value contains quotes. Next.js .env parser handles this, but verify loop.');
            }
        }
    });

    if (!found) {
        console.error('❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in file!');
    }

} catch (e) {
    console.error('❌ Failed to read file:', e.message);
}
