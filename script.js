function initParticles() {
            const particleCount = Math.min(Math.max(Math.floor((window.innerWidth * window.innerHeight) / (1920 * 1080) * 150), 50), 300);
            
            tsParticles.load("particles-js", {
                particles: {
                    number: { value: particleCount },
                    size: { value: 1.5 },
                    move: {
                        enable: true,
                        speed: 0.5,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "bounce"
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#954aff",
                        opacity: 0.4,
                        width: 1
                    },
                    color: {
                        value: "#ffffff"
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
                "День начинается — время делать великие дела!",
                "Чашка кофе и вперёд покорять мир ☕", "5 утра? Ты уже впереди 99% населения.",
                "Сегодня будет продуктивный день, я чувствую!",
                "Разбуди в себе зверя (но сначала кофе).",
                "Кто рано встаёт… тот потом хочет спать.",
                "Ты уверен, что проснулся? Проверь: 2+2=4? Если да, то да.",
                "Утро добрым не бывает (но попробуем).",
                "Если ты это читаешь — значит, ты герой.",
                "Спасибо, что не выключил будильник и не проспал.",
                "\"Начинаем новый квест под названием День\". (Сохранение загружено)",
                "\"Утро — тёмное время\". © Каждый программист.",
                "\"Я не жаворонок, я сова, которую поймали на рассвете\".",
                "Твой мозг ещё в режиме \"загрузки ОС\". Подожди 5 минут.",
                "Кортизол на максимуме — значит, всё идёт по плану.",
                "Сегодня ты сделаешь то, что откладывал месяц. Прямо сейчас.",
                "Пора записать 3 главные задачи дня (нет, \"проснуться\" не считается).",
                "\"Компиляция дня началась!\"",
                "\"Утро туманное, утро седое…\" Но хотя бы живой.", "Вставай! Коты уже обсудили твои планы и не одобрили."
            ];
            const afternoon = [
                "Добрый день! Как твои сверхдержавы?",
                "Послеобеденный режим: выглядеть занятым, пока кофе работает.",
                "Продуктивность — это миф, но давай делать вид!",
                "Ты уже пережил утро — теперь осталось пережить день.",
                "Идеальное время для второго завтрака (или третьего кофе).",
                "Если день идёт не так — вини Меркурий в ретроградности.",
                "Главное достижение дня: ты не удалил систему. Пока что.",
                "Солнце в зените, а ты всё ещё в пижаме? Респект!",
                "Час дня — идеальное время для первой полезной задачи. Или нет.",
                "Пора проверить: 'А что, если просто... ничего не делать?'",
                "День — это просто долгий перерыв между утром и вечером.",
                "Ты не прокрастинируешь — ты исследуешь альтернативные методы тайм-менеджмента!",
                "Сейчас бы поспать... но надо делать 'важные взрослые дела'.",
                "Напоминание: ты уже молодец. Но можно ещё немного.",
                "Если день не удался — значит, он аутентичный!",
                "Рабочий настрой: 'Я не ленивый, я энергосберегающий.'",
                "Совет дня: если код не работает — попробуй устроить перекур. Или нет.",
                "Доказано наукой: после 15:00 мозг превращается в пудинг.",
                "Ты не устал — ты в режиме энергосбережения!",
                "Критическая точка дня: когда понимаешь, что 'рано встал' — это ошибка.",
                "Если бы день был кодом, его давно бы откатили.",
                "Оптимизм — это когда веришь, что до вечера всё сделаешь. Реализм — это когда смеёшься.",
                "Сейчас бы лечь... но впереди ещё 'целых полдня'!",
                "Напоминание: даже котики иногда просто лежат. Ты тоже имеешь право.",
                "День — это как спринт в марафоне под названием 'Неделя'."
                ];
            const evening = [
                "Добрый вечер! Какой главный подвиг сегодня?",
                "Пора замедлиться: вечер — это как Ctrl+S для души.",
                "Ты пережил день. Теперь можно и пострадать... то есть отдохнуть.",
                "Идеальное время для чая, пледа и мыслей о вечном.",
                "Напоминание: ты не обязан быть продуктивным после 20:00.",
                "Если бы день был кодом — сейчас было бы время для рефакторинга.",
                "Вечерний ритуал: пересмотреть все решения дня и посмеяться.",
                "Ты не устал — ты в режиме «мягкого завершения процессов».",
                "Критическая точка вечера: когда понимаешь, что «завтра» — это слишком скоро.",
                "Совет: закрой все вкладки, кроме тех, что «ну вот ещё 5 минуточек».",
                "Утро — для планов, день — для действий, вечер — для сожаления об этом всём.",
                "Главное достижение вечера: ты не уснул в тарелке с ужином.",
                "Время перейти в горизонтальный режим и обновить кэш.",
                "Если день был тяжёлым — завтра будет... ну, тоже день. Но хотя бы другой!",
                "Пора принять важное решение: «Спать или досмотреть сериал?»",
                "Вечер — это когда ты наконец можешь делать «ничего» без угрызений совести.",
                "Напоминание: даже сервера иногда рестартят. Ты тоже имеешь право.",
                "Ты не прокрастинируешь — ты даёшь мозгу дефрагментацию!",
                "Если завтра — это новый день, то вечер — это его черновик.",
                "Сейчас бы лечь спать... но ведь в интернете ещё есть неоткрытые вкладки!",
                "Финальный аккорд дня: «Я всё сделаю завтра. На этот раз точно.»",
                "Вечерний челлендж: заснуть раньше, чем телефон упадёт на лицо.",
                "Время для главного вопроса: «Кто я и зачем открыл этот холодильник?»",
                "Ты не засыпаешь — ты переходишь в режим standby.",
                "Подводим итоги: сегодня ты молодец. Даже если не очень. Главное — что живой."
                ];
            const night = [
                "Ночь. Код пишется сам. (Нет.)",
                "Тишина. Только ты и монитор. И голоса в голове.",
                "3:47 — идеальное время для вопросов 'кто я?' и 'зачем коммитить это?'",
                "Ночной режим активирован: зрачки расширены, кофеин в крови, здравый смысл отключён.",
                "Ты не должен быть продуктивным. Но раз уж не спишь...",
                "В это время гении творят. А ты чем занят? (Да, 'скроллить мемы' тоже вариант.)",
                "Напоминание: сон — это просто death() без сохранения состояния.",
                "Критическая точка ночи: когда код начинает казаться осмысленным.",
                "Если бы бессонница была языком — ты бы уже был senior-разработчиком.",
                "404: Sleep Not Found. Попробуйте позже.",
                "Ночь. Кофе закончился. Надежда тоже. Зато гитки зелёные.",
                "Ты не сова. Ты — человек, случайно увидевший 4 утра.",
                "Время, когда Google знает ответы, но стыдно искать 'почему я ещё не сплю'.",
                "Главное ночное достижение: не заснуть лицом в клавиатуре. Пока что.",
                "Сейчас бы спать... но ведь 'ещё одна задача' — это так заманчиво.",
                "Ночные логи: 'Зачем?' → 'Почему нет?' → 'Ой.' → 'Надо поспать.' → (цикл)",
                "Ты не ложишься спать — ты делаешь асинхронный переход в standby.",
                "Если ночь — это твой coding session, то утро будет exception handling.",
                "Время, когда все нормальные люди спят. А ты... чем ты занимаешься?",
                "Напоминание: солнце всё равно взойдёт. К сожалению.",
                "Ночная мудрость: 'Завтра я точно лягу пораньше'. (Шутка.)",
                "Тёмная сторона продуктивности: ты ещё работаешь или уже галлюцинируешь?",
                "Ночь — это когда ты понимаешь, что 'рано вставать' было ошибкой.",
                "Пора спать. (Шучу. Кто вообще спит в 2 ночи?)",
                "Финальный статус: 'я ещё живой' с модификатором 'но зачем'."
                ];
            let greeting;
            
            if (hour >= 5 && hour < 12) greeting = morning[Math.floor(Math.random() * morning.length)];
            else if (hour >= 12 && hour < 19) greeting = afternon[Math.floor(Math.random() * afternon.length)];
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
            } catch (error) {
                document.getElementById("weather").innerHTML = "🌡️ Погода недоступна";
                console.error("Ошибка загрузки погоды:", error);
            }
        }

        function setupHotkeys() {
            document.addEventListener("keydown", function(event) {
                if (event.ctrlKey) {
                    switch(event.key.toLowerCase()) {
                        case 'y': window.open("https://ya.ru", "_blank"); break;
                        case 'g': window.open("https://github.com", "_blank"); break;
                        case 'm': window.open("https://mail.google.com", "_blank"); break;
                        case 't': window.open("https://translate.google.com", "_blank"); break;
                    }
                }
                
                // // Пробел - пауза/воспроизведение музыки
                // if (event.code === "Space") {
                //     event.preventDefault();
                //     const audio = document.getElementById("bg-music");
                //     audio.paused ? audio.play() : audio.pause();
                // }
            });
        }
        
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
            setupHotkeys();
            initParticles();
            
            const audio = document.getElementById("bg-music");
            audio.volume = 0.15;
            
            document.body.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play().catch(e => console.log("Автовоспроизведение заблокировано:", e));
                }
            }, { once: true });
            
            window.addEventListener('resize', handleResize);
        });