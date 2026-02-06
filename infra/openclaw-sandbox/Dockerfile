# OpenClaw Sandbox Image
# Isolated execution environment for agent tool calls
#
# This image is used by OpenClaw to execute tools in a sandboxed environment.
# It contains common utilities but runs with restricted permissions.

FROM debian:bookworm-slim

LABEL maintainer="A.I.M.S. Team"
LABEL description="OpenClaw sandbox for isolated tool execution"

# Install essential tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    git \
    jq \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create sandbox user (non-root)
RUN groupadd -g 1000 sandbox && \
    useradd -u 1000 -g sandbox -m -s /bin/bash sandbox

# Create workspace directory
RUN mkdir -p /workspace && chown sandbox:sandbox /workspace

# Security: Remove dangerous commands
RUN rm -f /usr/bin/su /usr/bin/sudo 2>/dev/null || true

# Set working directory
WORKDIR /workspace

# Switch to non-root user
USER sandbox

# Default command
CMD ["bash"]
