#!/bin/sh
BHOST=${BACKEND_HOST:-mascotas-app}

cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name ;
    root /usr/share/nginx/html;
    index index.html;

    location /mascotas {
        proxy_pass http://bhost_placeholder:8080/mascotas;
        proxy_read_timeout 30s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
EOF

sed -i "s/BHOST_PLACEHOLDER/$BHOST/g" /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"