import { spawnSync } from 'child_process';

export default async () => {
    const seedProcess = spawnSync('npm', ['run', 'migrate:test:reset'], { stdio: 'inherit' });
    if (seedProcess.status !== 0) {
        throw new Error('Database reset failed.');
    } else {
        console.log('Database reset completed.');
    }
};
