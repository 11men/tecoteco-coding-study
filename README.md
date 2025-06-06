# 💯 코딩테스트 스터디, 테코테코

**함께 자료구조와 알고리즘을 뿌시고 성장하는 개발자들의 공간입니다.**

이곳은 코딩테스트 완전 정복을 목표로 하는 스터디 모임 **테코테코**의 공식 GitHub 레포지토리입니다.

![tecoteco-profile.png](posters%2Ftecoteco-profile.png)

## 🎯 우리의 지향점 (Our Philosophy & Goals)

테코테코는 알고리즘 풀이라는 하나의 구심점을 갖고 있지만 문제만 풀지는 않아요. 다음과 같은 가치를 함께 만들어 갑니다.

* **함께의 가치 🤝** 혼자서는 꾸준히 하기 어려운 알고리즘 공부, 함께 모여 서로를 이끌어주고 동기를 부여합니다. 잘하든 못하든, 일단 참여하면 뭐라도 배우게 되는 마법을 경험할 수 있습니다.

* **성장의 경험 🌱** 정답 코드만 보고 넘어가는 것이 아니라, 동료의 코드를 리뷰하고 토론하며 문제의 본질을 깊이 파고듭니다. 막혔던 부분에서 다 같이 "어?\!" 하고 깨달음을 얻는 순간의 즐거움이야말로 테코테코의 핵심입니다.

* **현대적 접근 🤖** GPT와 같은 AI 도구를 배척하지 않습니다. 오히려 더 나은 질문을 통해 문제 해결의 힌트를 얻고, 내 코드를 개선하는 등 AI를 똑똑하게 활용하는 방법을 함께 고민하고 공유하는 진보적인 스터디를 지향합니다.

* **최종 목표 🏆**
  단순히 코딩 테스트를 '통과'하는 것을 넘어, 문제의 본질을 꿰뚫는 **논리적 사고력**과 어떤 상황에서도 최적의 해결책을 찾아내는 **견고한 알고리즘 실력**을 갖추는 것을 목표로 합니다. 또한, 함께 코드를 리뷰하고 토론하는 과정 속에서 자신의 생각을 명확하게 설명하고 동료를 설득하는 **커뮤니케이션 역량**을 기릅니다.



## 📖 스터디 운영 방식 (How We Roll)

* **정기 모임:** **매주 금요일 저녁 7:30 \~ 9:30**
* **장소:** **강남역 인근 스터디룸** (매주 Discord를 통해 장소 공지)
* **모임 방식:** 오프라인 모임을 중심으로 하며, 상황에 따라 온라인(Discord)으로 전환될 수 있습니다.
* **주요 교재:** [코딩 테스트 합격자 되기: 자바 편 (골드래빗)](https://product.kyobobook.co.kr/detail/S000212576322)
* **온라인 저지:** [프로그래머스](https://school.programmers.co.kr/learn/challenges), [백준](https://www.acmicpc.net/)
* **스터디 비용:** 스터디룸 대관료는 참석자끼리 N/1로 정산해요.

#### 진행 흐름 (예시)

| 시간              | 활동 내용                                       |
| ----------------- | ----------------------------------------------- |
| **19:30 \~ 20:20** | **이론/코드 리뷰** (선정된 리뷰어가 주제/문제 발표) |
| **20:20 \~ 20:30** | **휴식 및 네트워킹** |
| **20:30 \~ 21:30** | **함께 문제 풀이** (다같이 실시간으로 문제 해결)      |

## 🚀 참여 방법 (How to Join)

** 현재는 공식 모집은 안하고 있어요. 관심 있으신 분들에 한해서 참여 방법을 안내드리고 있어요. `@renechoi`에게 커피챗 주세요! 



## 💻 GitHub 레포지토리 가이드라인 (Repository Guidelines)

우리의 스터디 기록을 차곡차곡 쌓고, 동료의 코드를 쉽게 찾아볼 수 있도록 아래의 가이드라인을 따라주세요. 강제적인 규칙은 아니지만, 함께 지켜나갈 때 스터디가 더욱 풍성해집니다.

#### 1. 폴더 구조 📂
큰 틀의 구조만 유지해주시면 됩니다. 기본적으로 **시즌 > 주차/주제 > 문제 > 작성자** 순으로 정리하고 있습니다.

* **문제 풀이 폴더 예시:**
    ```
    - season02
      - week15_set
        - [02] 영어 끝말잇기
          - renechoi
            - 영어 끝말잇기.java
    ```
* **이론 학습 폴더 예시:**
    ```
    - season1.5
      - study
        - queue
          - 우선순위큐_리뷰.md
    ```

#### 2. 커밋 메시지 💬
어떤 작업을 했는지 다른 사람이 쉽게 알아볼 수 있도록 작성하는 것을 권장합니다. 정해진 형식은 없지만, 아래 예시처럼 플랫폼과 문제 이름을 포함해주시면 좋습니다.

* **문제 풀이 커밋 예시:**
    * `[Programmers] kdelay - 폰켓몬`
    * `[백준] 집합의 표현 / renechoi`
* **공지/리뷰 자료 업데이트 커밋 예시:**
    * `[시즌 2 - 15주차] - 유니온 파인드 시간 복잡도`
    * `feat: week3 jiwonlee 풀이`

#### 3. 파일명 규칙 ✍️
로컬 환경에서 레포지토리를 클론할 때 오류가 발생하지 않도록, 특정 OS에서 인식하지 못하는 특수문자는 파일명에 사용하지 말아주세요.

* 🚫 **사용 자제 문자:** `?`, `*`, `:`, `<`, `>`, `|` 등



## 👣 우리의 발자취 (Our Journey)

* **시즌 1 (2024.09 \~ 2024.12):** 자료구조 기본기 다지기 (배열, 스택, 큐, 해시, 트리)
* **시즌 1.5 (2025.01 \~ 2025.03):** 자료구조 복습 및 문제풀이 집중
* **시즌 2 (2025.04 \~ 진행중):** 심화 알고리즘 정복 (집합, 그래프, 백트래킹, DP, 그리디)

![2025-3q4q-schedule.png](posters%2F2025-3q4q-schedule.png)

## 👨‍👩‍👧‍👦 함께하는 사람들 (Members)

테코테코를 만들어가는 멤버들입니다.

`위의 Contributors 섹션을 참고해주세요 👋🏻` 










