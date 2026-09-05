output "server_ipv4" {
  description = "Public IPv4 address of the backend server (Point your api.srimatch.com DNS A record here)"
  value       = hcloud_server.backend_server.ipv4_address
}

output "server_ipv6" {
  description = "Public IPv6 address of the backend server"
  value       = hcloud_server.backend_server.ipv6_address
}

output "volume_id" {
  description = "ID of the attached persistent NVMe data volume"
  value       = hcloud_volume.data_volume.id
}

output "ssh_command" {
  description = "Command to connect via SSH to the server"
  value       = "ssh root@${hcloud_server.backend_server.ipv4_address}"
}
