variable "base_cidr" {
  type        = string
  default     = "11.0.0.0/16"
  description = "CIDR to divide up."
}

variable "az_count" {
  type        = number
  default     = 2
  description = "Number of availability zones within the region to use."
}

variable "top_level_domain" {
  type        = string
  default     = "creek-burn.net"
  description = "Top Level Domain to create subdomains from."
}
