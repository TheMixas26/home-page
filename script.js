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
            let greeting;
            
            if (hour >= 5 && hour < 12) greeting = "Доброе утро!";
            else if (hour >= 12 && hour < 18) greeting = "Добрый день!";
            else if (hour >= 18 && hour < 23) greeting = "Добрый вечер!";
            else greeting = "Доброй ночи!";
            
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