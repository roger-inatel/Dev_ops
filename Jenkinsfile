// =============================================================================
// Jenkinsfile - AdotaPet (Projeto S07 NP2 / INATEL)
//
// IMPORTANTE para o time:
//   - As stages abaixo sao declaradas (atendem ao PDF: "as etapas do pipeline
//     devem estar no Jenkinsfile, NAO na GUI"). O conteudo de cada `steps` esta
//     marcado com // TODO - o GRUPO escreve cada `sh '...'`, pra ninguem cair no
//     criterio eliminatorio "copiar IA sem entender".
//   - Unica stage que ja tem conteudo pronto: 'Notify' - chama
//     scripts/notify-email.js, que le NOTIFY_EMAIL do ambiente (nao hardcoded).
//   - Block `post { always {...} }` ja arquiva pacote + relatorio de testes
//     (requisito "artefatos no Jenkins").
//
// Pre-requisitos do agente (ja resolvidos por jenkins/Dockerfile):
//   - Node 20+, npm
//   - Docker CLI
//   - git
//
// Variaveis de ambiente que devem estar configuradas no Jenkins (Manage Jenkins
// -> Credentials ou Configure System -> Global properties):
//   NOTIFY_EMAIL  - destino do e-mail (OBRIGATORIO; sem ele a stage Notify falha)
//   SMTP_HOST     - default 'host.docker.internal' (alcanca MailHog do compose)
//   SMTP_PORT     - default '1025'
//   DOCKERHUB_*   - credenciais do Docker Hub (para a stage Build, se publicar)
// =============================================================================

pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    // SMTP do MailHog (compose principal). Pode ser sobrescrito por
    // 'Manage Jenkins > Configure System > Global properties'.
    SMTP_HOST = "${env.SMTP_HOST ?: 'host.docker.internal'}"
    SMTP_PORT = "${env.SMTP_PORT ?: '1025'}"
    SMTP_FROM = "${env.SMTP_FROM ?: 'jenkins@adotapet.local'}"

    // NOTIFY_EMAIL NAO deve ser hardcoded aqui. Use 'Configure System' ou
    // credentials() no Jenkins. Linha abaixo apenas garante propagacao.
    NOTIFY_EMAIL = "${env.NOTIFY_EMAIL ?: ''}"
  }

  stages {

    // ---------------------------------------------------------------------
    // 1) CHECKOUT - permitido pelo PDF usar GUI para isso, mas tambem fica
    //               aqui para o pipeline ser 100% reproduzivel.
    // ---------------------------------------------------------------------
    stage('Checkout') {
      steps {
        echo "Branch: ${env.GIT_BRANCH ?: 'desconhecida'}"
        checkout scm
      }
    }

    // ---------------------------------------------------------------------
    // 2) INSTALL - instala dependencias do backend, frontend e scripts/.
    //              TODO time: escolha entre rodar `npm ci` em cada pasta ou
    //              usar um docker-compose run.
    // ---------------------------------------------------------------------
    stage('Install') {
      steps {
        echo 'Instalando dependencias...'
        // TODO time: ex.:
        //   sh 'cd backend  && npm ci'
        //   sh 'cd frontend && npm ci'
        //   sh 'cd scripts  && npm ci'
        sh 'echo "TODO: time preenche - npm ci em backend/, frontend/ e scripts/"'
      }
    }

    // ---------------------------------------------------------------------
    // 3) TEST - PDF exige esta etapa. Rodar testes unitarios com coverage e
    //           gerar relatorio (junit.xml para o Jenkins) E o relatorio HTML
    //           para o time abrir manualmente.
    //           Threshold do Jest ja esta em 90% (backend/package.json e
    //           frontend/package.json), entao se a cobertura cair, o build
    //           quebra automaticamente nesta stage.
    // ---------------------------------------------------------------------
    stage('Test') {
      steps {
        echo 'Rodando testes...'
        // TODO time: ex.:
        //   sh 'cd backend  && npx prisma generate && npm run test:cov'
        //   sh 'cd frontend && npm test -- --coverage --ci --reporters=default --reporters=jest-junit'
        sh 'echo "TODO: time preenche - test:cov no back e test --coverage no front"'
      }
    }

    // ---------------------------------------------------------------------
    // 4) BUILD - PDF exige esta etapa. Empacotar a aplicacao e gerar uma
    //            imagem Docker pronta para publicacao no Docker Hub.
    // ---------------------------------------------------------------------
    stage('Build') {
      steps {
        echo 'Empacotando a aplicacao e gerando imagem Docker...'
        // TODO time: ex.:
        //   sh 'cd backend && npm run build'
        //   sh 'docker build -t SEU_USUARIO/adotapet-backend:${BUILD_NUMBER} -f backend/Dockerfile backend'
        //   withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'U', passwordVariable: 'P')]) {
        //     sh 'echo $P | docker login -u $U --password-stdin'
        //     sh 'docker push SEU_USUARIO/adotapet-backend:${BUILD_NUMBER}'
        //   }
        sh 'echo "TODO: time preenche - npm run build + docker build + docker push"'
      }
    }

    // ---------------------------------------------------------------------
    // 5) NOTIFY - PDF exige notificacao por e-mail. Usa scripts/notify-email.js
    //             que ja le NOTIFY_EMAIL do ambiente (nao hardcoded).
    //             Esta stage JA FUNCIONA - nao precisa de TODO.
    // ---------------------------------------------------------------------
    stage('Notify') {
      steps {
        script {
          if (!env.NOTIFY_EMAIL?.trim()) {
            error 'NOTIFY_EMAIL nao configurado. Defina em "Manage Jenkins > Configure System > Global properties".'
          }
        }
        // O script abaixo le NOTIFY_EMAIL, SMTP_HOST, SMTP_PORT, BUILD_STATUS,
        // BUILD_NUMBER, BUILD_URL, JOB_NAME, GIT_BRANCH, GIT_COMMIT do ambiente.
        sh '''
          cd scripts
          [ -d node_modules ] || npm ci
          BUILD_STATUS=${BUILD_STATUS:-SUCCESS} node notify-email.js
        '''
      }
    }
  }

  // -------------------------------------------------------------------------
  // POST - artefatos (pacote + relatorio de testes) sao arquivados em todo
  //        build, mesmo quando ele falha. Atende ao requisito "Pacote e
  //        relatorio de testes devem ser armazenados como artefatos no Jenkins".
  //        E na falha, dispara o notify-email com BUILD_STATUS=FAILURE.
  // -------------------------------------------------------------------------
  post {
    always {
      // Relatorios JUnit -> ficam visiveis na pagina "Test Result" do build.
      junit allowEmptyResults: true, testResults: 'backend/junit*.xml, frontend/junit*.xml'

      // Pacote + relatorio HTML/lcov de coverage -> artefatos do build.
      archiveArtifacts artifacts: 'backend/dist/**, backend/coverage/**, frontend/.next/**, frontend/coverage/**',
                       allowEmptyArchive: true,
                       fingerprint: true
    }

    failure {
      script {
        env.BUILD_STATUS = 'FAILURE'
      }
      sh '''
        cd scripts
        [ -d node_modules ] || npm ci
        node notify-email.js || true
      '''
    }
  }
}
