# Hetzner Cloud API Token (Generate in Hetzner Cloud Console -> Project -> Security -> API Tokens)
hcloud_token = "nVdx8PbUKMa3c9wUG3Xcmhyz2RXbP0WA2ZkSKvG1bZanamS2GwVUXr9N6a7NWgxr"

# Server configuration
server_name = "srimatch-prod-backend"
server_type = "cpx21" # 3 vCPU / 4 GB RAM (~€9.50/mo in Singapore) or cpx31 (4 vCPU / 8 GB RAM)
location    = "sin"   # Singapore location (ultra-low latency to Sri Lanka)
image       = "ubuntu-24.04"

# Your public SSH key (e.g., contents of ~/.ssh/id_rsa.pub or ~/.ssh/id_ed25519.pub)
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILijMyZ2iuJCDjUchlPGTf2AlThBpXPEE1FcH/yClq/R deploy@sithum-dev.online"
ssh_key_name   = "srimatch-deploy-key"

# Persistent storage for PostgreSQL data
volume_size_gb = 50

# Allowed SSH IP addresses (use ["0.0.0.0/0", "::/0"] or restrict to your specific office/home IP)
allowed_ssh_ips = ["0.0.0.0/0", "::/0"]
