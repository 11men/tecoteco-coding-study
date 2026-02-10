variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-northeast-2"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "solid"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "EC2 Key Pair name (must exist in AWS)"
  type        = string
}

variable "my_ip" {
  description = "Your IP for SSH access (CIDR format, e.g. 1.2.3.4/32)"
  type        = string
}

variable "domain_name" {
  description = "Root domain name in Route 53 (e.g. example.com)"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for the service (e.g. solid)"
  type        = string
  default     = "solid"
}

variable "ebs_volume_size" {
  description = "EBS volume size in GB"
  type        = number
  default     = 30
}
