# Config
This directory contains general and environment based configuration information, which includes necessary credentials. Configs are provided through ServerConfigService to make it easy to potentially replace implementation with dependency injection when necessary. Production config file is not included in this repository for obvious reasons.

TypeScript files are used instead of env/json files because it is easier to use with TypeScript and it allows the use of comments as well as type detection.
