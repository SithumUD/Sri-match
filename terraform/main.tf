terraform {
  required_version = ">= 1.5.0"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.48"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

# 1. SSH Key Registration
resource "hcloud_ssh_key" "deploy_key" {
  name       = var.ssh_key_name
  public_key = var.ssh_public_key
}

# 2. Firewall Rules (Strict Ingress)
resource "hcloud_firewall" "backend_firewall" {
  name = "srimatch-backend-firewall"

  # SSH Access
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = var.allowed_ssh_ips
  }

  # HTTP (Let's Encrypt ACME Challenge & HTTP->HTTPS Redirect)
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS (Secure API and WebSocket traffic)
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # ICMP Ping for Health Monitoring
  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

# 3. Persistent NVMe Storage Volume for Database & Uploads
resource "hcloud_volume" "data_volume" {
  name      = "srimatch-data-volume"
  size      = var.volume_size_gb
  location  = var.location
  format    = "ext4"
  automount = true
}

# 4. Hetzner Cloud Server (Singapore Datacenter)
resource "hcloud_server" "backend_server" {
  name        = var.server_name
  server_type = var.server_type
  image       = var.image
  location    = var.location
  ssh_keys    = [hcloud_ssh_key.deploy_key.id]
  firewall_ids = [hcloud_firewall.backend_firewall.id]

  user_data = file("${path.module}/cloud-init.yaml")

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  labels = {
    project     = "srimatch"
    environment = "production"
    role        = "backend"
  }
}

# 5. Attach Persistent Volume to Server
resource "hcloud_volume_attachment" "data_attachment" {
  volume_id = hcloud_volume.data_volume.id
  server_id = hcloud_server.backend_server.id
  automount = true
}
