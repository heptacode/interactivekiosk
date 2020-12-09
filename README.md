# Interactive Kiosk

## 작품 설명
Interactive Kiosk는 다양한 사용자를 위한 키오스크 개선 프로젝트입니다.

핵심 기능인 ‘음성으로 주문하기’는 STT를 활용하여 사용자의 음성을 텍스트로 변환하고, 자체 구현한 정규표현식으로 구문을 분석하는 과정을 거친 후, TTS를 통해 음성 피드백을 제공합니다.
또한 PWA와 Electron을 활용하여 스마트폰 뿐만 아니라, 다양한 환경에서도 작동할 수 있도록 했습니다.

## 사용된 API
- STT : Clova Speech Recognition - © NAVER Cloud Corp.
- TTS : Vocalware - © Oddcast Inc.
