import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';


const folder = process.argv[2] ?? '.';

const ls = async (folder) => {
    let files;
    let filePath;
    let stats;
    let isDirectory;
    let fileType;
    let fileSize;
    let modificationDate;

    try{
        files = await fs.readdir(folder);
    }
    catch{
        console.error(`Error reading directory ${folder}`);
        process.exit(1);
    }

    const filePromises = files.map(async file => {
        filePath = path.join(folder, file);
        
        try{
            stats = await fs.stat(filePath);
        }
        catch {
            console.error(`Error getting stats from1 ${filePath}`);
            process.exit(1);
        }

        isDirectory = stats.isDirectory();
        fileType = isDirectory ? 'D' : '-';
        fileSize = stats.size;
        modificationDate = stats.mtime.toLocaleString();

        return `${pc.yellow(fileType)} ${pc.green(file.padEnd(20))} ${pc.blue(fileSize.toString().padStart(10))} ${pc.blue(modificationDate)}`
    });

    const fileInfo = await Promise.all(filePromises)
    fileInfo.forEach(file => console.log(file));
} 

ls(folder);