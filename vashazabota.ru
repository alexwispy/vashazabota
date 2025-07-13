# Сервер для редиректа HTTP на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name vashazabota.ru www.vashazabota.ru;

    return 301 https://$host$request_uri;  # Перенаправляем все HTTP-запросы на HTTPS
}

# Конфигурация для HTTPS
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name vashazabota.ru www.vashazabota.ru;

    # Путь к папке с вашими статическими файлами
    root /var/www/vashazabota/frontend/build;
    index index.html;

    # Обслуживание статических файлов
    location / {
        try_files $uri $uri/ /index.html;  # Перенаправляем все запросы на index.html
    }
    # Обслуживание robots.txt как статического файла
    location /robots.txt {
        try_files $uri =404;  # Возвращаем файл robots.txt, если он существует
    }

    # Прокси для API
    location /api/ {
        proxy_pass http://127.0.0.1:5001/;  # Проксируем запросы на сервер Node.js на порту 5001
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Убедитесь, что API возвращает JSON, а не HTML
        add_header Content-Type application/json always;
                  # Настройка заголовков CORS
        add_header 'Access-Control-Allow-Origin' 'https://vashazabota.ru';  # Разрешаем запросы с этого домена
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';  # Разрешаем методы
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';  # Разрешаем нужные заголовки
        add_header 'Access-Control-Allow-Credentials' 'true';  # Разрешаем отправку куки (если нужно)

        # Если это OPTIONS-запрос, сразу возвращаем ответ
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        # Увеличение тайм-аутов
        proxy_read_timeout 300;
        proxy_send_timeout 300;
    }

    # Прокси для sitemap.xml, отдается сервером
    location /sitemap.xml {
        proxy_pass http://127.0.0.1:5001/sitemap.xml;  # Проксируем запросы на sitemap.xml к серверу на порту 5001
    }

    # Настройки SSL
    ssl_certificate /etc/letsencrypt/live/vashazabota.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vashazabota.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}