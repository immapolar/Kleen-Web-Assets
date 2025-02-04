const fs = require('fs').promises;
const path = require('path');

class CommentsCleaner {
    constructor() {
        this.patterns = {
            html: /<!--[\s\S]*?-->|<%--[\s\S]*?--%>/g,
            css: /\/\*[\s\S]*?\*\//g,
            jsSingle: /\/\/.*?$/gm,
            jsMulti: /\/\*[\s\S]*?\*\//g,
            endLine: /[\t ]*(?:\/\/|#).*$/gm
        };
    }

    cleanContent(content, fileExt) {
        switch (fileExt) {
            case '.html':
            case '.ejs':
                content = content.replace(this.patterns.html, '');
                content = content.replace(this.patterns.endLine, '');
                break;
                
            case '.css':
                content = content.replace(this.patterns.css, '');
                content = content.replace(this.patterns.endLine, '');
                break;
                
            case '.js':
            case '.jsx':
            case '.ts':
            case '.tsx':
                content = content.replace(this.patterns.jsSingle, '');
                content = content.replace(this.patterns.jsMulti, '');
                break;
                
            default:
                content = content.replace(this.patterns.html, '');
                content = content.replace(this.patterns.css, '');
                content = content.replace(this.patterns.jsSingle, '');
                content = content.replace(this.patterns.jsMulti, '');
                content = content.replace(this.patterns.endLine, '');
        }
        
        return content;
    }

    normalizeContent(content) {
        return content
            .replace(/^\s*[\r\n]/gm, '')
            .replace(/[\r\n]{2,}/g, '\n')
            .replace(/[ \t]+$/gm, '')
            .trim() + '\n';
    }

    async ensureDir(dirPath) {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }

    async processFile(srcPath, distPath) {
        try {
            const content = await fs.readFile(srcPath, 'utf8');
            const ext = path.extname(srcPath).toLowerCase();
            
            const cleanedContent = this.normalizeContent(
                this.cleanContent(content, ext)
            );
            
            await this.ensureDir(path.dirname(distPath));
            
            await fs.writeFile(distPath, cleanedContent, 'utf8');
            
            return true;
        } catch (error) {
            console.error(`Error processing ${srcPath}:`, error);
            return false;
        }
    }

    async processDirectory(srcDir = './src', distDir = './dist', extensions = ['.html', '.ejs', '.css', '.js', '.jsx', '.ts', '.tsx']) {
        try {
            try {
                await fs.access(srcDir);
            } catch {
                throw new Error(`Source directory '${srcDir}' does not exist`);
            }

            await this.ensureDir(distDir);

            const results = {
                processed: 0,
                failed: 0,
                skipped: 0
            };

            const files = await fs.readdir(srcDir);

            for (const file of files) {
                const srcPath = path.join(srcDir, file);
                const distPath = path.join(distDir, file);
                const stat = await fs.stat(srcPath);

                if (stat.isDirectory()) {
                    const subResults = await this.processDirectory(
                        srcPath,
                        distPath,
                        extensions
                    );
                    results.processed += subResults.processed;
                    results.failed += subResults.failed;
                    results.skipped += subResults.skipped;
                } else if (extensions.includes(path.extname(srcPath).toLowerCase())) {
                    const success = await this.processFile(srcPath, distPath);
                    if (success) {
                        results.processed++;
                    } else {
                        results.failed++;
                    }
                } else {
                    try {
                        await this.ensureDir(path.dirname(distPath));
                        await fs.copyFile(srcPath, distPath);
                        results.skipped++;
                    } catch (error) {
                        console.error(`Error copying ${srcPath}:`, error);
                        results.failed++;
                    }
                }
            }

            return results;
        } catch (error) {
            console.error('Error processing directory:', error);
            throw error;
        }
    }
}

async function main() {
    const cleaner = new CommentsCleaner();
    
    try {
        const results = await cleaner.processDirectory();
        console.log('\nProcessing completed:');
        console.log(`✓ Processed: ${results.processed} files`);
        console.log(`× Failed: ${results.failed} files`);
        console.log(`- Copied without processing: ${results.skipped} files`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = CommentsCleaner;