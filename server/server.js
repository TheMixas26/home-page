const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// server.js находится в папке server/
// config.json лежит рядом с server.js
const CONFIG_PATH = path.join(__dirname, 'config.json');

// Статические файлы сайта лежат на уровень выше server.js
const STATIC_DIR = path.resolve(__dirname, '..');

function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error(
            'Не найден config.json. Скопируй config.example.json в config.json и укажи свои пути.'
        );
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

const config = loadConfig();

const MUSIC_EXTENSIONS = new Set([
    '.mp3',
    '.ogg',
    '.wav',
    '.flac',
    '.m4a',
    '.opus'
]);

const AUDIO_MIME = {
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.flac': 'audio/flac',
    '.m4a': 'audio/mp4',
    '.opus': 'audio/opus'
};

const STATIC_MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

// ---------- Кеш списка музыки ----------

let musicCache = null;
let musicCacheTime = 0;

const MUSIC_CACHE_TTL = 60 * 60 * 1000; // 60 минут

function walkDir(dir, baseDir, exts, out) {
    let entries;

    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return;
    }

    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walkDir(full, baseDir, exts, out);
        } else if (exts.has(path.extname(entry.name).toLowerCase())) {
            out.push(
                path
                    .relative(baseDir, full)
                    .split(path.sep)
                    .join('/')
            );
        }
    }
}

function getMusicList(forceRefresh) {
    const now = Date.now();

    if (
        !forceRefresh &&
        musicCache &&
        now - musicCacheTime < MUSIC_CACHE_TTL
    ) {
        return musicCache;
    }

    const out = [];

    walkDir(
        config.musicDir,
        config.musicDir,
        MUSIC_EXTENSIONS,
        out
    );

    musicCache = out;
    musicCacheTime = now;

    return out;
}

// ---------- Задачи из Obsidian ----------
// Ищем строки вида "- [ ] текст" или "- [x] текст"

const TASK_RE = /^(\s*)-\s\[( |x|X)\]\s(.+)$/;

function findMdFiles(dir, baseDir, out) {
    let entries;

    try {
        entries = fs.readdirSync(dir, {
            withFileTypes: true
        });
    } catch (e) {
        return;
    }

    for (const entry of entries) {
        // Пропускаем .obsidian и прочие скрытые служебные папки
        if (entry.name.startsWith('.')) {
            continue;
        }

        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            findMdFiles(full, baseDir, out);
        } else if (
            entry.name.toLowerCase().endsWith('.md')
        ) {
            out.push(full);
        }
    }
}

function getOpenTasks() {
    const files = [];

    findMdFiles(
        config.vaultDir,
        config.vaultDir,
        files
    );

    const tasks = [];

    for (const file of files) {
        let lines;

        try {
            lines = fs
                .readFileSync(file, 'utf-8')
                .split('\n');
        } catch (e) {
            continue;
        }

        lines.forEach((line, idx) => {
            const m = line.match(TASK_RE);

            if (m && m[2] === ' ') {
                tasks.push({
                    file: path
                        .relative(config.vaultDir, file)
                        .split(path.sep)
                        .join('/'),

                    line: idx,

                    text: m[3].trim()
                });
            }
        });
    }

    return tasks;
}

function completeTask(relFile, lineIdx) {
    const vaultRoot = path.resolve(config.vaultDir);

    const full = path.resolve(
        vaultRoot,
        relFile
    );

    // Защита от выхода за пределы vaultDir через "../"
    if (
        full !== vaultRoot &&
        !full.startsWith(vaultRoot + path.sep)
    ) {
        throw new Error('Недопустимый путь');
    }

    if (!fs.existsSync(full)) {
        throw new Error('Файл не найден');
    }

    const content = fs.readFileSync(
        full,
        'utf-8'
    );

    const lines = content.split('\n');

    if (
        lineIdx < 0 ||
        lineIdx >= lines.length
    ) {
        throw new Error('Строка не найдена');
    }

    const m = lines[lineIdx].match(TASK_RE);

    if (!m) {
        throw new Error(
            'Это не задача или файл уже изменился'
        );
    }

    // Проверяем, что задача ещё не выполнена
    if (m[2] !== ' ') {
        throw new Error('Задача уже выполнена');
    }

    lines[lineIdx] = lines[lineIdx].replace(
        '- [ ]',
        '- [x]'
    );

    fs.writeFileSync(
        full,
        lines.join('\n'),
        'utf-8'
    );
}

// ---------- Вспомогательные функции HTTP ----------

function sendJson(res, status, data) {
    const body = JSON.stringify(data);

    res.writeHead(status, {
        'Content-Type':
            'application/json; charset=utf-8',

        'Content-Length':
            Buffer.byteLength(body),

        'Access-Control-Allow-Origin': '*',

        'Access-Control-Allow-Methods':
            'GET, POST, OPTIONS',

        'Access-Control-Allow-Headers':
            'Content-Type'
    });

    res.end(body);
}

// ---------- Стриминг музыки ----------

function streamAudio(req, res, relPath) {
    const musicRoot = path.resolve(config.musicDir);

    const full = path.resolve(
        musicRoot,
        relPath
    );

    // Защита от ../
    if (
        full !== musicRoot &&
        !full.startsWith(musicRoot + path.sep)
    ) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    if (!fs.existsSync(full)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    let stat;

    try {
        stat = fs.statSync(full);
    } catch (e) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    if (!stat.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const ext = path.extname(full).toLowerCase();

    const mime =
        AUDIO_MIME[ext] ||
        'application/octet-stream';

    const range = req.headers.range;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes'
    };

    // Без Range — отдаём весь файл
    if (!range) {
        res.writeHead(200, {
            ...headers,
            'Content-Length': stat.size,
            'Content-Type': mime
        });

        fs.createReadStream(full).pipe(res);

        return;
    }

    // Поддержка Range: bytes=start-end
    const match = range.match(
        /^bytes=(\d*)-(\d*)$/
    );

    if (!match) {
        res.writeHead(416, {
            'Content-Range':
                `bytes */${stat.size}`
        });

        res.end();

        return;
    }

    let start;
    let end;

    const startStr = match[1];
    const endStr = match[2];

    if (startStr === '') {
        // bytes=-500
        const suffixLength = parseInt(
            endStr,
            10
        );

        start = Math.max(
            stat.size - suffixLength,
            0
        );

        end = stat.size - 1;
    } else {
        start = parseInt(startStr, 10);

        end = endStr
            ? parseInt(endStr, 10)
            : stat.size - 1;
    }

    if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 0 ||
        start >= stat.size ||
        end < start
    ) {
        res.writeHead(416, {
            'Content-Range':
                `bytes */${stat.size}`
        });

        res.end();

        return;
    }

    end = Math.min(
        end,
        stat.size - 1
    );

    res.writeHead(206, {
        ...headers,

        'Content-Range':
            `bytes ${start}-${end}/${stat.size}`,

        'Content-Length':
            end - start + 1,

        'Content-Type': mime
    });

    fs.createReadStream(full, {
        start,
        end
    }).pipe(res);
}

// ---------- Раздача статических файлов ----------

function serveStatic(req, res, pathname) {
    // Главная страница
    if (pathname === '/') {
        pathname = '/index.html';
    }

    let decodedPath;

    try {
        decodedPath = decodeURIComponent(pathname);
    } catch (e) {
        res.writeHead(400);
        res.end('Bad request');
        return;
    }

    // Защита от ../
    const staticRoot = path.resolve(STATIC_DIR);

    const fullPath = path.resolve(
        staticRoot,
        '.' + decodedPath
    );

    if (
        fullPath !== staticRoot &&
        !fullPath.startsWith(staticRoot + path.sep)
    ) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    let stat;

    try {
        stat = fs.statSync(fullPath);
    } catch (e) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    if (!stat.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const ext = path.extname(fullPath).toLowerCase();

    const mime =
        STATIC_MIME[ext] ||
        'application/octet-stream';

    const headers = {
        'Content-Type': mime,
        'Content-Length': stat.size
    };

    // HEAD-запрос — только заголовки
    if (req.method === 'HEAD') {
        res.writeHead(200, headers);
        res.end();
        return;
    }

    res.writeHead(200, headers);

    fs.createReadStream(fullPath).pipe(res);
}

// ---------- HTTP-сервер ----------

const server = http.createServer(
    (req, res) => {
        let url;

        try {
            url = new URL(
                req.url,
                `http://${req.headers.host || 'localhost'}`
            );
        } catch (e) {
            res.writeHead(400);
            res.end('Bad request');
            return;
        }

        // CORS preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',

                'Access-Control-Allow-Methods':
                    'GET, POST, OPTIONS',

                'Access-Control-Allow-Headers':
                    'Content-Type'
            });

            res.end();

            return;
        }

        // ---------- API ----------

        if (
            url.pathname === '/api/ping' &&
            req.method === 'GET'
        ) {
            return sendJson(
                res,
                200,
                { ok: true }
            );
        }

        if (
            url.pathname === '/api/music' &&
            req.method === 'GET'
        ) {
            const refresh =
                url.searchParams.get('refresh') === '1';

            return sendJson(
                res,
                200,
                {
                    files: getMusicList(refresh)
                }
            );
        }

        if (
            url.pathname === '/api/music/stream' &&
            req.method === 'GET'
        ) {
            const rel =
                url.searchParams.get('path');

            if (!rel) {
                res.writeHead(400);
                res.end('Missing path');
                return;
            }

            return streamAudio(
                req,
                res,
                rel
            );
        }

        if (
            url.pathname === '/api/tasks' &&
            req.method === 'GET'
        ) {
            try {
                return sendJson(
                    res,
                    200,
                    {
                        tasks: getOpenTasks()
                    }
                );
            } catch (e) {
                return sendJson(
                    res,
                    500,
                    {
                        error: e.message
                    }
                );
            }
        }

        if (
            url.pathname === '/api/tasks/complete' &&
            req.method === 'POST'
        ) {
            let body = '';

            req.on('data', chunk => {
                body += chunk;

                // Простая защита от слишком большого тела
                if (body.length > 1024 * 1024) {
                    req.destroy();
                }
            });

            req.on('end', () => {
                try {
                    const {
                        file,
                        line
                    } = JSON.parse(body);

                    if (
                        typeof file !== 'string' ||
                        !Number.isInteger(line)
                    ) {
                        throw new Error(
                            'Некорректные данные'
                        );
                    }

                    completeTask(
                        file,
                        line
                    );

                    sendJson(
                        res,
                        200,
                        { ok: true }
                    );
                } catch (e) {
                    sendJson(
                        res,
                        400,
                        {
                            error: e.message
                        }
                    );
                }
            });

            return;
        }

        // ---------- Статические файлы ----------
        // Всё, что не /api/ и является GET/HEAD,
        // пытаемся найти в папке уровнем выше server.js

        if (
            req.method === 'GET' ||
            req.method === 'HEAD'
        ) {
            return serveStatic(
                req,
                res,
                url.pathname
            );
        }

        res.writeHead(404);
        res.end('Not found');
    }
);

// ---------- Запуск ----------

const PORT = config.port || 5177;

server.listen(PORT, () => {
    console.log(
        `Сервер запущен: http://localhost:${PORT}/`
    );

    console.log(
        `Статические файлы: ${STATIC_DIR}`
    );

    console.log(
        `Музыка: ${config.musicDir}`
    );

    console.log(
        `Obsidian: ${config.vaultDir}`
    );
});