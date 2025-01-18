//Problem 1: Directory Organizer
const fs = require('fs');
const path = require('path');

function organizeDirectory(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);

        const fileCategories = {
            Images: ['.jpg', '.jpeg', '.png', '.gif'],
            Documents: ['.pdf', '.docx', '.txt'],
            Videos: ['.mp4', '.avi']
        };

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            for (const [category, extensions] of Object.entries(fileCategories)) {
                if (extensions.includes(ext)) {
                    const categoryPath = path.join(directoryPath, category);
                    if (!fs.existsSync(categoryPath)) {
                        fs.mkdirSync(categoryPath);
                    }
                    fs.renameSync(
                        path.join(directoryPath, file),
                        path.join(categoryPath, file)
                    );
                    break;
                }
            }
        });
        console.log('Directory organized successfully.');
    } catch (error) {
        console.error('Error organizing directory:', error.message);
    }
}

// Example usage: organizeDirectory('/path/to/directory');

//Problem 2: File Backup System
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function backupFiles(sourceDirectory, backupDirectory) {
    try {
        const files = fs.readdirSync(sourceDirectory);

        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, { recursive: true });
        }

        const logStream = fs.createWriteStream(path.join(backupDirectory, 'backup-log.txt'), { flags: 'a' });

        files.forEach(file => {
            const sourcePath = path.join(sourceDirectory, file);
            const backupPath = path.join(backupDirectory, file);

            fs.copyFileSync(sourcePath, backupPath);
            logStream.write(`File backed up: ${file} at ${new Date().toISOString()}\n`);
        });

        logStream.end();
        console.log('Backup completed successfully.');

        // Optional: compress the backup folder
        const output = fs.createWriteStream(`${backupDirectory}.zip`);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', function () {
            console.log(`Backup archive created successfully: ${archive.pointer()} total bytes`);
        });

        archive.pipe(output);
        archive.directory(backupDirectory, false);
        archive.finalize();
    } catch (error) {
        console.error('Error during backup:', error.message);
    }
}

// Example usage: backupFiles('/path/to/source', '/path/to/backup');

//Problem 3: Environment Inspector
const fs = require('fs');
const os = require('os');
const process = require('process');
const path = require('path');

function inspectEnvironment() {
    try {
        const envDetails = {
            homeDirectory: os.homedir(),
            hostname: os.hostname(),
            networkInterfaces: os.networkInterfaces(),
            environmentVariables: process.env
        };

        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const filePath = path.join(logsDir, 'env-details.json');
        fs.writeFileSync(filePath, JSON.stringify(envDetails, null, 2));
        console.log('Environment details saved successfully.');
    } catch (error) {
        console.error('Error inspecting environment:', error.message);
    }
}

// Example usage: inspectEnvironment();
