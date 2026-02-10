output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.solid.id
}

output "elastic_ip" {
  description = "Elastic IP address"
  value       = aws_eip.solid.public_ip
}

output "domain" {
  description = "Service URL"
  value       = "https://${var.subdomain}.${var.domain_name}"
}

output "ssh_command" {
  description = "SSH command to connect"
  value       = "ssh -i ${var.key_name}.pem ec2-user@${aws_eip.solid.public_ip}"
}

output "deploy_steps" {
  description = "First deploy steps"
  value       = <<-EOT
    1. SSH 접속:
       ssh -i ${var.key_name}.pem ec2-user@${aws_eip.solid.public_ip}

    2. setup 완료 확인 (수 분 소요):
       ls ~/.setup-complete

    3. 코드 클론:
       cd ~/app && git clone https://github.com/11men/tecoteco-coding-study.git .

    4. SSL 인증서 발급:
       sudo certbot --nginx -d ${var.subdomain}.${var.domain_name}

    5. 배포:
       ~/deploy.sh

    6. 이후 재배포:
       ~/deploy.sh
  EOT
}
