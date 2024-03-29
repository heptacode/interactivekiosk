<template>
  <div class="home">
    <div class="banner">
      <img src="/assets/images/payments.svg" alt="Payments Image" draggable="false" />
      <div class="text">
        <h2 class="title">다양한 사용자를 위한 KIOSK 개선 프로젝트</h2>
        <span class="version">Release 1.1.0</span>
        <span class="subtitle">구현 기능</span>
        <ul>
          <li>주문하기</li>
          <li>음성으로 주문하기</li>
          <li>관리자 페이지 - 재고 관리</li>
        </ul>
      </div>
    </div>
    <div class="actions">
      <app-button
        v-if="isElectron && !earphoneDetection"
        @click="activateEarphoneDetection(), startHelloLoop()"
        >이어폰 감지 활성화</app-button
      >
      <app-button v-if="isElectron" @click="requestAssistant">도움 요청</app-button>
      <app-button @click="$router.replace('order')">시작하기</app-button>
    </div>
    <div class="voiceorder" @click="$router.replace('/voiceorder')"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';

@Component({})
export default class Home extends Vue {
  @State('isElectron') isElectron!: boolean;
  @State('earphoneDetection') earphoneDetection!: boolean;

  @Mutation('activateEarphoneDetection') activateEarphoneDetection!: Function;

  @Action('startHelloLoop') startHelloLoop!: Function;
  @Action('playAudio', { namespace: 'AudioModule' }) playAudio!: Function;

  @Action('SEND_NOTIFICATION', { namespace: 'FirebaseModule' }) sendNotification!: Function;

  @Watch('earphoneDetection')
  changeEarphoneDetection() {
    if (!this.earphoneDetection) return;
    this.playAudio({ isLocal: true, data: 'home/detection_activated' });
  }

  mounted() {
    navigator.mediaDevices.addEventListener('devicechange', event => {
      if (this.earphoneDetection)
        try {
          this.$router.replace('/voiceorder');
        } catch (err) {
          console.error(err);
        }
    });

    if (this.earphoneDetection) this.startHelloLoop();
  }

  requestAssistant() {
    alert('관리자에게 도움을 요청했습니다.');
    // this.sendNotification();
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .banner {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    padding: 32px;

    border-radius: 20px;
    background: linear-gradient(145deg, #e6e6e6, #ffffff);
    box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

    img {
      display: block;

      width: calc(50% - 32px);
      max-height: 370px;
      margin-right: 32px;
    }
    .text {
      flex: 0 0 fit-content;

      word-break: keep-all;

      .title {
        font-size: 28px;
        line-height: 1.1em;
      }
      .version {
        display: block;

        margin-bottom: 16px;

        color: rgba(#000, 0.65);
        font-size: 20px;
        line-height: 1.1em;
      }
      .subtitle {
        font-size: 18px;
        font-weight: bold;

        &::before {
          content: '# ';
        }
      }
      ul {
        padding-left: 1em;

        list-style: none;

        li {
          display: flex;
          align-items: center;

          &::before {
            content: '';

            display: block;
            box-sizing: border-box;

            width: 8px;
            height: 8px;
            margin-right: 8px;

            border: 2px solid rgba(#000, 0.65);
            border-radius: 50%;
          }
        }
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    margin-top: 40px;

    width: 100%;
    max-width: 500px;
    .app-button {
      font-size: 1.2em;
      height: 50px;
      margin: 10px;
    }
  }
  .voiceorder {
    width: 50px;
    height: 50px;

    cursor: pointer;
  }
}
</style>
