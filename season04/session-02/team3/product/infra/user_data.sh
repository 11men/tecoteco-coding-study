#!/bin/bash
set -euxo pipefail

# --- System Update ---
dnf update -y

# --- Docker ---
dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# --- Docker Compose ---
DOCKER_COMPOSE_VERSION="v2.29.1"
curl -SL "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# --- Git ---
dnf install -y git

# --- Nginx (for Certbot) ---
dnf install -y nginx
systemctl enable nginx
systemctl start nginx

# --- Certbot ---
dnf install -y augeas-libs
python3 -m venv /opt/certbot
/opt/certbot/bin/pip install certbot certbot-nginx
ln -sf /opt/certbot/bin/certbot /usr/bin/certbot

# --- Certbot auto-renewal cron ---
echo "0 0,12 * * * root /usr/bin/certbot renew --quiet" > /etc/cron.d/certbot-renew

# --- App directory ---
mkdir -p /home/ec2-user/app
chown ec2-user:ec2-user /home/ec2-user/app

# --- Deploy script ---
cat > /home/ec2-user/deploy.sh << 'DEPLOY_EOF'
#!/bin/bash
set -euxo pipefail

cd /home/ec2-user/app

# Pull latest code
git pull origin main

# Navigate to project
cd season04/session-02/team3/product

# Build and run
docker-compose down || true
docker-compose up -d --build

echo "Deploy complete!"
DEPLOY_EOF
chmod +x /home/ec2-user/deploy.sh
chown ec2-user:ec2-user /home/ec2-user/deploy.sh

# --- Setup complete marker ---
touch /home/ec2-user/.setup-complete
echo "=== EC2 setup complete for ${domain} ==="
