---
path: '/gitlab-cicd'
date: '2022-03-30T10:26:31.014Z'
title: 'gitlab-cicd'
tags: ['tag']
released: false
---

- pipeline 流水线，由 stage 和 job 组成
- job 是每一步需要做的任务
- stage 是阶段，如编译、测试、发布
- runner 跑 job 工具人，有多个可以同步跑
- schedule 定时运行

## pipeline

流水线类型：

- Basic pipelines
- Directed Acyclic Graph Pipeline (DAG) pipelines
- Merge request pipelines
- Merged results pipelines
- Merge trains
- Parent-child pipelines
- Multi-project pipelines

```yaml
stages:
  - build
  - test
  - deploy

image: alpine

build_a:
  stage: build
  script:
    - echo "This job builds something."

build_b:
  stage: build
  script:
    - echo "This job builds something else."

test_a:
  stage: test
  script:
    - echo "This job tests something. It will only run when all jobs in the"
    - echo "build stage are complete."

test_b:
  stage: test
  script:
    - echo "This job tests something else. It will only run when all jobs in the"
    - echo "build stage are complete too. It will start at about the same time as test_a."

deploy_a:
  stage: deploy
  script:
    - echo "This job deploys something. It will only run when all jobs in the"
    - echo "test stage complete."

deploy_b:
  stage: deploy
  script:
    - echo "This job deploys something else. It will only run when all jobs in the"
    - echo "test stage complete. It will start at about the same time as deploy_a."
```

- 需要提高流水线效率可以使用 Directed Acyclic Graphs (DAG)，大概就是无视 stage，满足配置的 needs 就能进入下一步
- 用 cache:when 更新依赖
- 优化 docker 镜像

## job

### 分组

```
build ruby 1/3:
  stage: build
  script:
    - echo "ruby1"

build ruby 2/3:
  stage: build
  script:
    - echo "ruby2"
```

### 隐藏

```
.hidden_job:
  script:
    - run test
```

### 运行条件

https://docs.gitlab.com/ee/ci/jobs/job_control.html

## 变量

### 打印变量

```
job_name:
  script:
    - export
    # - 'dir env:'  # Use this for PowerShell
```

```
export CI_JOB_ID="50"
export CI_COMMIT_SHA="1ecfd275763eff1d6b4844ea3168962458c9f27a"
export CI_COMMIT_SHORT_SHA="1ecfd275"
export CI_COMMIT_REF_NAME="main"
export CI_REPOSITORY_URL="https://gitlab-ci-token:[masked]@example.com/gitlab-org/gitlab-foss.git"
export CI_COMMIT_TAG="1.0.0"
export CI_JOB_NAME="spec:other"
export CI_JOB_STAGE="test"
export CI_JOB_MANUAL="true"
export CI_JOB_TRIGGERED="true"
export CI_JOB_TOKEN="[masked]"
export CI_PIPELINE_ID="1000"
export CI_PIPELINE_IID="10"
export CI_PAGES_DOMAIN="gitlab.io"
export CI_PAGES_URL="https://gitlab-org.gitlab.io/gitlab-foss"
export CI_PROJECT_ID="34"
export CI_PROJECT_DIR="/builds/gitlab-org/gitlab-foss"
export CI_PROJECT_NAME="gitlab-foss"
export CI_PROJECT_TITLE="GitLab FOSS"
export CI_PROJECT_NAMESPACE="gitlab-org"
export CI_PROJECT_ROOT_NAMESPACE="gitlab-org"
export CI_PROJECT_PATH="gitlab-org/gitlab-foss"
export CI_PROJECT_URL="https://example.com/gitlab-org/gitlab-foss"
export CI_REGISTRY="registry.example.com"
export CI_REGISTRY_IMAGE="registry.example.com/gitlab-org/gitlab-foss"
export CI_REGISTRY_USER="gitlab-ci-token"
export CI_REGISTRY_PASSWORD="[masked]"
export CI_RUNNER_ID="10"
export CI_RUNNER_DESCRIPTION="my runner"
export CI_RUNNER_TAGS="docker, linux"
export CI_SERVER="yes"
export CI_SERVER_URL="https://example.com"
export CI_SERVER_HOST="example.com"
export CI_SERVER_PORT="443"
export CI_SERVER_PROTOCOL="https"
export CI_SERVER_NAME="GitLab"
export CI_SERVER_REVISION="70606bf"
export CI_SERVER_VERSION="8.9.0"
export CI_SERVER_VERSION_MAJOR="8"
export CI_SERVER_VERSION_MINOR="9"
export CI_SERVER_VERSION_PATCH="0"
export GITLAB_USER_EMAIL="user@example.com"
export GITLAB_USER_ID="42"
```

预设变量文档：https://docs.gitlab.com/ee/ci/variables/predefined_variables.html

## cache

在 job 之间缓存，每个 job 不用重复下载相同的东西

- Define cache per job by using the cache keyword. Otherwise it is disabled.
- Subsequent pipelines can use the cache.
- Subsequent jobs in the same pipeline can use the cache, if the dependencies are identical.
- Different projects cannot share the cache.
