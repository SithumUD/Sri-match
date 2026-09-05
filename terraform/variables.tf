variable "hcloud_token" {
  description = "Hetzner Cloud API Token"
  type        = string
  sensitive   = true
}

variable "server_name" {
  description = "Name of the Hetzner Cloud server"
  type        = string
  default     = "srimatch-prod-backend"
}

variable "server_type" {
  description = "Server instance type (e.g. cpx21 for 3 vCPU/4GB RAM or cpx31 for 4 vCPU/8GB RAM)"
  type        = string
  default     = "cpx21"
}

variable "location" {
  description = "Hetzner Datacenter location (sin = Singapore for low latency to Sri Lanka)"
  type        = string
  default     = "sin"
}

variable "image" {
  description = "Base operating system image"
  type        = string
  default     = "ubuntu-24.04"
}

variable "ssh_public_key" {
  description = "Public SSH key for server access and CI/CD deployment"
  type        = string
}

variable "ssh_key_name" {
  description = "Name for the SSH key in Hetzner Cloud"
  type        = string
  default     = "srimatch-deploy-key"
}

variable "volume_size_gb" {
  description = "Size of the attached NVMe storage volume in GB for PostgreSQL and backups"
  type        = number
  default     = 50
}

variable "allowed_ssh_ips" {
  description = "CIDR blocks allowed to connect to SSH (0.0.0.0/0 for anywhere, or your IP for security)"
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}
