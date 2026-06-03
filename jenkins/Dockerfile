# Imagem customizada de Jenkins para o pipeline AdotaPet (Projeto S07 NP2).
#
# Por que customizar a imagem ?
#  - O PDF exige: "Qualquer software necessario para a execucao do pipeline
#    deve ser instalado via script ou Dockerfile."
#  - O pipeline precisa de: Node 20 (rodar testes/build do back e do front),
#    Docker CLI (buildar e publicar imagem da app no Docker Hub) e git
#    (checkout). A imagem oficial do Jenkins NAO traz nem Node nem Docker CLI.
#
# Estrategia:
#  - Base: jenkins/jenkins:lts-jdk21 (suporte longo, Java 21).
#  - Camada root para instalar dependencias do SO + Node 20 (nodesource).
#  - Camada root para instalar o Docker CLI (binario oficial) - sem o daemon,
#    pois o container vai usar o socket do host (montado em
#    docker-compose.jenkins.yml).
#  - Volta para o usuario 'jenkins' no final.

FROM jenkins/jenkins:lts-jdk21

LABEL br.inatel.s07.np2.project="AdotaPet"
LABEL br.inatel.s07.np2.maintainer="time-devops"

USER root

# 1) Dependencias basicas + Node 20 LTS (via NodeSource)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
         ca-certificates curl gnupg lsb-release git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# 2) Docker CLI (so o cliente; o daemon eh o do host, via socket montado)
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg \
         -o /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
         https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
         > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
         docker-ce-cli docker-buildx-plugin docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# 3) Permitir que o usuario 'jenkins' use o socket /var/run/docker.sock
#    montado pelo compose. O GID do grupo 'docker' do host pode variar - o
#    compose pode sobrescrever via 'group_add'.
RUN groupadd -f docker && usermod -aG docker jenkins

# 4) Plugins pre-instalados (sem usar a GUI do Jenkins para configurar nada)
#    - workflow-aggregator: pipelines declarativos (Jenkinsfile)
#    - git: checkout do SCM (criterio do PDF permite usar GUI so para checkout)
#    - junit: leitura de relatorios JUnit (test:cov gera via jest-junit)
#    - htmlpublisher: publicar HTML coverage (artefato extra)
#    - docker-workflow: passos docker.image() no pipeline
#    - email-ext: ja existe stage 'Notify' via nodemailer; este plugin fica
#                 apenas como fallback caso o time prefira mailer nativo.
RUN jenkins-plugin-cli --plugins \
      workflow-aggregator:latest \
      git:latest \
      junit:latest \
      htmlpublisher:latest \
      docker-workflow:latest \
      email-ext:latest \
      timestamper:latest \
      ws-cleanup:latest

USER jenkins
