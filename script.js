function renderCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    let html = `<div style="font-weight:bold; margin-bottom:4px;">${monthNames[month]} ${year}</div>`;
    html += '<table><thead><tr>';
    const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    for (let d of days) html += `<th>${d}</th>`;
    html += '</tr></thead><tbody><tr>';
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 7 : firstDay;
    for (let i = 1; i < firstDay; i++) html += '<td></td>';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = firstDay;
    for (let date = 1; date <= daysInMonth; date++) {
        const isToday = date === today;
        html += `<td class="${isToday ? 'today' : ''}">${date}</td>`;
        if (dayOfWeek === 7 && date !== daysInMonth) {
            html += '</tr><tr>';
            dayOfWeek = 0;
        }
        dayOfWeek++;
    }
    while (dayOfWeek <= 7 && dayOfWeek !== 1) {
        html += '<td></td>';
        dayOfWeek++;
    }
    html += '</tr></tbody></table>';
    calendar.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', renderCalendar);
let currentWeatherCategory = 'clear';

function getWeatherParticleOverrides(category) {
    switch (category) {
        case 'cloudy':
            return { speed: 0.4, direction: 'none', linkOpacity: 0.25, color: '#cfcfcf', sizeMult: 1 };
        case 'rain':
            return { speed: 3.5, direction: 'bottom', linkOpacity: 0.08, color: '#8fbfff', sizeMult: 0.7 };
        case 'snow':
            return { speed: 0.6, direction: 'bottom', linkOpacity: 0.15, color: '#ffffff', sizeMult: 1.8 };
        case 'storm':
            return { speed: 5, direction: 'none', linkOpacity: 0.15, color: '#ffe08a', sizeMult: 1.1 };
        default: // clear
            return { speed: 0.5, direction: 'none', linkOpacity: 0.4, color: '#ffffff', sizeMult: 1 };
    }
}

function initParticles(weatherCategory) {
    if (weatherCategory) currentWeatherCategory = weatherCategory;
    const overrides = getWeatherParticleOverrides(currentWeatherCategory);
    // Минимум и максимум для разных размеров экрана
    let minParticles = 10;
    let maxParticles = 300;
    let baseParticles = 150;
    // Для очень маленьких экранов (например, < 600px по ширине) — ещё меньше
    if (window.innerWidth < 600 || window.innerHeight < 400) {
        minParticles = 8;
        maxParticles = 30;
        baseParticles = 15;
    }
    const particleCount = Math.min(Math.max(Math.floor((window.innerWidth * window.innerHeight) / (1920 * 1080) * baseParticles), minParticles), maxParticles);
    tsParticles.load("particles-js", {
        particles: {
            number: { value: particleCount },
            size: { value: 1.5 * overrides.sizeMult },
            move: {
                enable: true,
                speed: overrides.speed,
                direction: overrides.direction,
                random: overrides.direction === 'none',
                straight: overrides.direction !== 'none',
                out_mode: "bounce"
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#954aff",
                opacity: overrides.linkOpacity,
                width: 1
            },
            color: {
                value: overrides.color
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                }
            }
        }
    });
}

function updateParticlesForWeather(weatherCode) {
    let category = 'clear';
    if (weatherCode > 0 && weatherCode < 50) category = 'cloudy';
    if (weatherCode >= 50 && weatherCode < 70) category = 'rain';
    if (weatherCode >= 70 && weatherCode < 90) category = 'snow';
    if (weatherCode >= 90) category = 'storm';
    initParticles(category);
}
        
        function updateClock() {
            const now = new Date();
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const timeString = now.toLocaleTimeString('ru-RU', timeOptions);
            
            document.getElementById('clock').textContent = timeString;
        }
        
        function updateGreeting() {
            const hour = new Date().getHours();
            const morning = [
                "Доброе утро!",
                "Доброго утра!",
                "Кто рано встаёт — тот идиот!)",
                "Кто рано встаёт… тот потом хочет спать.",
                "Утро добрым не бывает.",
                "Спасибо, что не выключил будильник и не проспал.",
                "\"Начинаем новый квест под названием День\". (Сохранение загружено)",
                "\"Утро — тёмное время\". © Каждый программист.",
                "\"Я не жаворонок, я сова, которую поймали на рассвете\".",
                "\"Утро туманное, утро седое…\" Но хотя бы живой.", "Вставай! Коты уже обсудили твои планы и не одобрили."
            ];
            const afternoon = [
                "Добрый день! Как твои сверхдержавы?",
                "Послеобеденный режим: выглядеть занятым, пока кофе работает.",
                "Добрый день!",
                "Ты уже пережил утро — теперь осталось пережить день.",
                "Идеальное время для второго завтрака (или третьего кофе).",
                "Доброго дня!",
                "Солнце в зените, а ты всё ещё в пижаме? Респект!",
                "Час дня — идеальное время для первой полезной задачи. Или нет.",
                "День — это просто долгий перерыв между утром и вечером.",
                "Доказано наукой: после 15:00 мозг превращается в пудинг.",
                "Критическая точка дня: когда понимаешь, что 'рано встал' — это ошибка.",
                "Если бы день был кодом, его давно бы откатили.",
                "Сейчас бы лечь... но впереди ещё 'целых полдня'!",
                ];
            const evening = [
                "Добрый вечер! Какой главный подвиг сегодня?",
                "Пора замедлиться: вечер — это как Ctrl+S для души.",
                "Ты пережил день. Теперь можно и пострадать... то есть отдохнуть.",
                "Вечер - идеальное время для чая, пледа и мыслей о вечном.",
                "Вечерний ритуал: пересмотреть все решения дня и посмеяться.",
                "Добрый вечер!",
                "Доброго вечера!",
                "Подводим итоги: сегодня ты молодец. Даже если не очень. Главное — что живой."
                ];
            const night = [
                "Ночь.",
                "Тишина. Только ты и монитор. И голоса в голове.",
                "3:47 — идеальное время для вопросов 'кто я?' и 'зачем коммитить это?'",
                "Ты не должен быть продуктивным. Но раз уж не спишь...",
                "404: Sleep Not Found. Попробуйте позже.",
                "Ночь. Кофе закончился. Надежда тоже. Зато гитки зелёные.",
                "Ты не сова. Ты — человек, случайно увидевший 4 утра.",
                "Время, когда Google знает ответы, но стыдно искать 'почему я ещё не сплю'.",
                "Главное ночное достижение: не заснуть лицом в клавиатуре. Пока что.",
                "Доброй ночи!",
                "Время, когда все нормальные люди спят. А ты... чем ты занимаешься?",
                "Ночная мудрость: 'Завтра я точно лягу пораньше'. (Шутка.)",
                "Пора спать. (Шучу. Кто вообще спит в 2 ночи?)",
                ];
            let greeting;
            
            if (hour >= 5 && hour < 12) greeting = morning[Math.floor(Math.random() * morning.length)];
            else if (hour >= 12 && hour < 19) greeting = afternoon[Math.floor(Math.random() * afternoon.length)];
            else if (hour >= 19 && hour < 23) greeting = evening[Math.floor(Math.random() * evening.length)];
            else greeting = night[Math.floor(Math.random() * night.length)];
            
            document.getElementById('greeting').textContent = greeting;
        }
        
        async function loadQuote() {
            try {
                document.getElementById('quote').textContent = "Загрузка...";
                const response = await fetch('file.txt');
                if (!response.ok) throw new Error('Файл не найден');
                
                const text = await response.text();
                const quotes = text.split('\n').filter(q => q.trim() !== '');
                
                if (quotes.length === 0) throw new Error('Нет цитат в файле');
                
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                document.getElementById('quote').textContent = randomQuote;
            } catch (error) {
                document.getElementById('quote').textContent = "Мысли создают реальность. — Будда";
                console.error("Ошибка загрузки цитат:", error);
            }
        }

        document.getElementById('refresh-quote').addEventListener('click', loadQuote);
        
        async function fetchWeather() {
            try {
                const lat = 45.0428;
                const lon = 41.9734;
                
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&windspeed_unit=ms`);
                
                if (!response.ok) throw new Error('Ошибка API погоды');
                
                const data = await response.json();
                const temp = Math.round(data.current_weather.temperature);
                const wind = Math.round(data.current_weather.windspeed * 3.6);
                const weatherCode = data.current_weather.weathercode;
                
                let weatherIcon = "☀️";
                if (weatherCode > 0 && weatherCode < 50) weatherIcon = "🌤️";
                if (weatherCode >= 50 && weatherCode < 70) weatherIcon = "🌧️";
                if (weatherCode >= 70 && weatherCode < 90) weatherIcon = "❄️";
                if (weatherCode >= 90) weatherIcon = "⛈️";
                
                document.getElementById("weather").innerHTML = `
                    ${weatherIcon} ${temp}°C | 💨 ${wind} км/ч
                `;
                updateParticlesForWeather(weatherCode);
            } catch (error) {
                document.getElementById("weather").innerHTML = "🌡️ Погода недоступна";
                console.error("Ошибка загрузки погоды:", error);
            }
        }

        // --- Горячие клавиши: удобно менять сочетания ---
        // Формат: { name: "описание", sequence: ["ctrl", "y"], url: "https://ya.ru" }
        const hotkeys = [
            { name: "Yandex", sequence: ["ctrl", "y"], url: "https://ya.ru" },
            { name: "GitHub", sequence: ["ctrl", "g"], url: "https://github.com" },
            { name: "Gmail", sequence: ["ctrl", "m"], url: "https://mail.google.com" },
            { name: "Telegram", sequence: ["w", "e", "b", "t"], url: "https://web.telegram.org" },
            { name: "Telegram-RU", sequence: ["ц", "у", "и", "е"], url: "https://web.telegram.org" },
            { name: "WhatsApp", sequence: ["w", "e", "b", "w"], url: "https://web.whatsapp.com" },
            { name: "WhatsApp-RU", sequence: ["ц", "у", "и", "ц"], url: "https://web.whatsapp.com" },
        ];

        let keySeq = [];
        let seqTimeout = null;
        const seqMaxDelay = 1300; // мс между нажатиями

        function matchHotkey(event) {
            // Проверка ctrl-комбинаций
            for (const hk of hotkeys) {
                if (hk.sequence.length === 2 && hk.sequence[0] === "ctrl") {
                    if (
                        event.ctrlKey &&
                        !event.altKey &&
                        !event.shiftKey &&
                        event.key.toLowerCase() === hk.sequence[1]
                    ) {
                        window.location.href = hk.url;
                        return true;
                    }
                }
            }
            return false;
        }

        function processSequence(key) {
            keySeq.push(key);
            clearTimeout(seqTimeout);
            seqTimeout = setTimeout(() => { keySeq = []; }, seqMaxDelay);

            for (const hk of hotkeys) {
                if (
                    hk.sequence.length > 2 &&
                    keySeq.length === hk.sequence.length &&
                    hk.sequence.every((k, i) => keySeq[i] === k)
                ) {
                    window.location.href = hk.url;
                    keySeq = [];
                    clearTimeout(seqTimeout);
                    break;
                }
            }
            // Обрезаем лишнее (если набрали больше, чем самая длинная последовательность)
            if (keySeq.length > 3) keySeq = [];
        }

        document.addEventListener("keydown", function(event) {
            if (matchHotkey(event)) {
                keySeq = [];
                return;
            }
            if (
                event.key.length === 1 &&
                !event.ctrlKey && !event.altKey && !event.shiftKey
            ) {
                processSequence(event.key.toLowerCase());
            } else {
                keySeq = [];
            }
        });
                // благослови господь нейросети..
        
        function handleResize() {
            initParticles();
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            updateClock();
            updateGreeting();
            setInterval(updateClock, 1000);
            setInterval(updateGreeting, 3600000);
            
            loadQuote();
            fetchWeather();
            initParticles();
            
                const audio = document.getElementById("bg-music");

                audio.volume = 0.15;

                const playBtn = document.getElementById('music-play');
                const muteBtn = document.getElementById('music-mute');
                const timeSpan = document.getElementById('music-time');

                const musicState = JSON.parse(localStorage.getItem('musicPlayerState') || '{}');
                if (musicState.muted !== undefined) audio.muted = musicState.muted;
                if (musicState.paused !== undefined) {
                    if (!musicState.paused) {
                        audio.play().catch(()=>{});
                    } else {
                        audio.pause();
                    }
                }
                if (musicState.currentTime !== undefined) {
                    audio.currentTime = musicState.currentTime;
                }

                function saveMusicState() {
                    localStorage.setItem('musicPlayerState', JSON.stringify({
                        muted: audio.muted,
                        paused: audio.paused,
                        currentTime: audio.currentTime
                    }));
                }

                function formatTime(sec) {
                    sec = Math.floor(sec);
                    const m = Math.floor(sec / 60).toString().padStart(2, '0');
                    const s = (sec % 60).toString().padStart(2, '0');
                    return `${m}:${s}`;
                }

                function updateMusicTime() {
                    if (!audio.duration) {
                        timeSpan.textContent = '00:00 / 00:00';
                        return;
                    }
                    timeSpan.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                }

                audio.addEventListener('timeupdate', () => {
                    updateMusicTime();
                    saveMusicState();
                });
                audio.addEventListener('loadedmetadata', updateMusicTime);
                setInterval(updateMusicTime, 1000);

                playBtn.addEventListener('click', () => {
                    if (audio.paused) {
                        audio.play();
                        playBtn.textContent = '⏸';
                    } else {
                        audio.pause();
                        playBtn.textContent = '▶';
                    }
                    saveMusicState();
                });

                muteBtn.addEventListener('click', () => {
                    audio.muted = !audio.muted;
                    muteBtn.textContent = audio.muted ? '×' : '♬';
                    saveMusicState();
                });

                playBtn.textContent = audio.paused ? '▶' : '⏸';
                muteBtn.textContent = audio.muted ? '×' : '♬';
                updateMusicTime();

                window.addEventListener('resize', handleResize);
            });

// ===================== Настройки, плейлист и задачи Obsidian =====================
// Всё это работает только когда включён "Локальный сервер" в настройках и сервер
// реально отвечает. На GitHub Pages (или если сервер выключен/недоступен) —
// сайт остаётся в обычном режиме: один трек music.mp3, без панели задач.

const SETTINGS_KEY = 'siteLocalSettings';

function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { localMode: false, serverUrl: 'http://localhost:5177' };
    } catch (e) {
        return { localMode: false, serverUrl: 'http://localhost:5177' };
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

async function pingServer(serverUrl) {
    try {
        const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/ping`, { signal: AbortSignal.timeout(2500) });
        return res.ok;
    } catch (e) {
        return false;
    }
}

function initSettingsPanel() {
    const toggleBtn = document.getElementById('settings-toggle');
    const panel = document.getElementById('settings-panel');
    const checkbox = document.getElementById('local-mode-checkbox');
    const urlInput = document.getElementById('local-server-url');
    const saveBtn = document.getElementById('settings-save');
    const statusEl = document.getElementById('settings-status');

    const settings = getSettings();
    checkbox.checked = settings.localMode;
    urlInput.value = settings.serverUrl || 'http://localhost:5177';

    toggleBtn.addEventListener('click', () => panel.classList.toggle('hidden'));

    saveBtn.addEventListener('click', async () => {
        statusEl.textContent = 'Проверка соединения...';
        statusEl.className = '';
        const serverUrl = urlInput.value.trim() || 'http://localhost:5177';
        const localMode = checkbox.checked;

        let ok = true;
        if (localMode) {
            ok = await pingServer(serverUrl);
        }

        saveSettings({ localMode, serverUrl });

        if (!localMode) {
            statusEl.textContent = 'Сохранено. Локальный режим выключен.';
            statusEl.className = 'ok';
        } else if (ok) {
            statusEl.textContent = 'Сервер найден! Обновляю страницу...';
            statusEl.className = 'ok';
            setTimeout(() => window.location.reload(), 800);
        } else {
            statusEl.textContent = 'Сервер не отвечает. Настройки сохранены, но включатся при следующей успешной проверке.';
            statusEl.className = 'err';
        }
    });
}

// ---------- Плейлист вместо одного трека ----------
const PLAYLIST_STATE_KEY = 'musicPlaylistState';

function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function trackDisplayName(relPath) {
    const base = relPath.split('/').pop();
    return base.replace(/\.[^.]+$/, '');
}

async function initPlaylistMusic(serverUrl) {
    let files;
    try {
        const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/music`);
        const data = await res.json();
        files = data.files || [];
    } catch (e) {
        console.error('Не удалось получить список музыки:', e);
        return;
    }
    if (files.length === 0) return;

    const audio = document.getElementById('bg-music');
    const prevBtn = document.getElementById('music-prev');
    const nextBtn = document.getElementById('music-next');
    const shuffleBtn = document.getElementById('music-shuffle');
    const trackNameEl = document.getElementById('music-track-name');

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(PLAYLIST_STATE_KEY)) || {}; } catch (e) {}

    let order = (saved.order && saved.order.length === files.length) ? saved.order : shuffle(files.map((_, i) => i));
    let currentIndex = (typeof saved.currentIndex === 'number' && saved.currentIndex < order.length) ? saved.currentIndex : 0;

    function saveState() {
        localStorage.setItem(PLAYLIST_STATE_KEY, JSON.stringify({
            order, currentIndex, currentTime: audio.currentTime
        }));
    }

    function loadTrack(index, autoplay) {
        currentIndex = index;
        const relPath = files[order[currentIndex]];
        audio.src = `${serverUrl.replace(/\/$/, '')}/api/music/stream?path=${encodeURIComponent(relPath)}`;
        trackNameEl.textContent = trackDisplayName(relPath);
        if (saved.currentTime && index === saved.currentIndex) {
            audio.currentTime = saved.currentTime;
        }
        if (autoplay) audio.play().catch(() => {});
        saveState();
    }

    function playNext() { loadTrack((currentIndex + 1) % order.length, !audio.paused); }
    function playPrev() { loadTrack((currentIndex - 1 + order.length) % order.length, !audio.paused); }

    audio.addEventListener('ended', playNext);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', () => {
        order = shuffle(files.map((_, i) => i));
        loadTrack(0, !audio.paused);
    });

    [prevBtn, nextBtn, shuffleBtn, trackNameEl].forEach(el => el.classList.remove('hidden'));

    loadTrack(currentIndex, false);
    audio.addEventListener('timeupdate', saveState);
}

// ---------- Задачи из Obsidian ----------
async function initTasks(serverUrl) {
    let tasks;
    try {
        const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/tasks`);
        const data = await res.json();
        tasks = data.tasks || [];
    } catch (e) {
        console.error('Не удалось получить задачи:', e);
        return;
    }

    const container = document.getElementById('tasks-container');
    const list = document.getElementById('tasks-list');
    const countEl = document.getElementById('tasks-count');
    container.classList.remove('hidden');

    function render() {
        list.innerHTML = '';
        countEl.textContent = tasks.length ? `(${tasks.length})` : '';
        if (tasks.length === 0) {
            list.innerHTML = '<li id="tasks-empty">Незавершённых задач нет 🎉</li>';
            return;
        }
        tasks.forEach((task, idx) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const textWrap = document.createElement('span');
            const textSpan = document.createElement('span');
            textSpan.textContent = task.text;
            const fileSpan = document.createElement('span');
            fileSpan.className = 'task-file';
            fileSpan.textContent = task.file;
            textWrap.appendChild(textSpan);
            textWrap.appendChild(fileSpan);
            li.appendChild(checkbox);
            li.appendChild(textWrap);
            list.appendChild(li);

            checkbox.addEventListener('change', async () => {
                li.classList.add('completing');
                checkbox.disabled = true;
                try {
                    const res = await fetch(`${serverUrl.replace(/\/$/, '')}/api/tasks/complete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ file: task.file, line: task.line })
                    });
                    if (!res.ok) throw new Error('Server error');
                    tasks.splice(idx, 1);
                    setTimeout(render, 300);
                } catch (e) {
                    console.error('Не удалось отметить задачу:', e);
                    li.classList.remove('completing');
                    checkbox.disabled = false;
                    checkbox.checked = false;
                }
            });
        });
    }

    render();
}

document.addEventListener('DOMContentLoaded', async () => {
    initSettingsPanel();
    const settings = getSettings();
    if (!settings.localMode) return;

    const serverUrl = settings.serverUrl || 'http://localhost:5177';
    const alive = await pingServer(serverUrl);
    if (!alive) {
        console.warn('Локальный режим включён, но сервер недоступен — остаёмся в обычном режиме.');
        return;
    }

    initPlaylistMusic(serverUrl);
    initTasks(serverUrl);
});