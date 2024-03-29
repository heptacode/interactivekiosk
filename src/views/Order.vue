<template>
  <div :class="{ order: !isElectron, 'order-electron': isElectron }">
    <div class="product-container">
      <div v-for="(item, idx) in stockList" :key="idx" class="product" @click="addItem(item)">
        <md-card md-with-hover>
          <md-ripple>
            <md-card-header v-if="!isElectron">
              <img :src="item.image" />
              <md-card-header-text>
                <div class="md-title">{{ item.name }}</div>
                <div class="md-subhead">{{ numberFormat(item.price) }}원</div>
              </md-card-header-text>
            </md-card-header>
            <div v-else>
              <md-card-media md-ratio="16:9">
                <img :src="item.image" />
              </md-card-media>
              <md-card-header>
                <div class="md-title">{{ item.name }}</div>
                <div class="md-subhead">{{ numberFormat(item.price) }}원</div>
              </md-card-header>
            </div>
          </md-ripple>
        </md-card>
      </div>
    </div>

    <div class="shoppingCart-container">
      <transition name="fade">
        <app-button
          v-if="!shoppingCartVisible && shoppingCart.length && !isElectron"
          class="shoppingCart-toggle"
          round
          @click="shoppingCartVisible = true"
        >
          <i class="iconify" data-icon="mdi:chevron-up"></i>
          장바구니 열기
        </app-button>
      </transition>

      <transition name="fade">
        <md-card
          class="shoppingCart"
          v-if="(shoppingCartVisible && shoppingCart.length) || isElectron"
        >
          <div class="shoppingCart-heading">
            <h1>장바구니</h1>
            <app-button v-if="!isElectron" round @click="shoppingCartVisible = false">
              <i class="iconify" data-icon="mdi:chevron-down"></i>
              숨기기
            </app-button>
            <app-button
              v-else
              round
              color="accent"
              :disabled="!shoppingCart.length"
              @click="shoppingCart.splice(0, shoppingCart.length)"
            >
              <i class="iconify" data-icon="mdi:trash"></i>
              비우기
            </app-button>
          </div>

          <div v-for="(item, idx) in shoppingCart" :key="idx" class="shoppingCart-item">
            <img :src="item.image" alt="" />
            <h2>{{ item.name }}</h2>

            <md-card-actions class="shoppingCart-actions">
              <app-button circle dense @click="decreaseItem(item)">-</app-button>
              <h3>&times;{{ item.quantity }}</h3>
              <app-button circle dense @click="increaseItem(item)">+</app-button>
            </md-card-actions>
            <h3 class="price">{{ numberFormat(item.price * item.quantity) }}원</h3>
          </div>

          <app-button
            class="checkout"
            round
            :disabled="!shoppingCart.length"
            @click="(shoppingCartVisible = false), (isCheckoutVisible = true)"
          >
            {{ getTotalPrice }}원 결제하기
          </app-button>
        </md-card>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="isCheckoutVisible" class="checkout-container">
        <md-card class="checkout">
          <div class="checkout-heading">
            <h1>결제하기</h1>
            <app-button
              round
              color="accent"
              @click="(isCheckoutVisible = false), (shoppingCartVisible = true)"
            >
              <i class="iconify" data-icon="mdi:close"></i>
              취소하기
            </app-button>
          </div>
          <img src="/assets/images/credit_card.svg" alt="Credit Card" />

          <h2 class="total">
            {{ getTotalPrice }}원을 결제하려면
            {{ !isElectron ? '결제 수단을 선택해주세요.' : '카드를 삽입해주세요.' }}
          </h2>
        </md-card>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { StockItem } from '@/schema';
import numberFormat from '@/utils/numberFormat';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component({})
export default class Order extends Vue {
  @State('isElectron') isElectron!: boolean;
  @State('stockList') stockList!: StockItem[];

  shoppingCartVisible: boolean = false;
  shoppingCart: StockItem[] = [];

  isCheckoutVisible: boolean = false;

  numberFormat(number: number) {
    return numberFormat(number);
  }

  addItem(item: StockItem) {
    this.shoppingCartVisible = true;

    let prevItem = this.shoppingCart.find(s => s.name == item.name);
    // 이미 장바구니에 있을 시 개수 +1
    if (prevItem) {
      // 남은 재고량 확인 후 증감
      if (this.stockList.find(i => i.name == item.name)!.quantity > prevItem.quantity)
        prevItem.quantity++;
    } else this.shoppingCart.push({ ...item, quantity: 1 });
  }
  increaseItem(item: StockItem) {
    let prevItem = this.shoppingCart.find(i => i.name == item.name);
    if (this.stockList.find(i => i.name == item.name)!.quantity > prevItem!.quantity)
      prevItem!.quantity++;
  }
  decreaseItem(item: StockItem) {
    let prevItem = this.shoppingCart.find(i => i.name == item.name);
    if (prevItem!.quantity-- <= 1) this.removeItem(item);
  }
  removeItem(item: StockItem) {
    let prevItemIdx = this.shoppingCart.findIndex(i => i.name == item.name);
    if (prevItemIdx != -1) this.shoppingCart.splice(prevItemIdx, 1);
  }

  get getTotalPrice(): string {
    return numberFormat(
      this.shoppingCart.reduce(
        (total: number, cartItem: StockItem) => total + cartItem.price * cartItem.quantity,
        0
      )
    );
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
  position: absolute;
  bottom: 0;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.order {
  display: flex;
  flex-direction: column;

  height: 100%;

  .product-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;

    .product {
      width: 100%;
      .md-ripple {
        height: 90px;
        img {
          width: 60px;
          height: 60px;
        }
        .md-title {
          margin: 0;
        }
        .md-card-header-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
  .shoppingCart-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    margin: 0 auto;
    margin-bottom: 15px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 60%;
    min-width: 400px;

    z-index: 10000;

    .shoppingCart-toggle {
      padding: 10px;
    }
    .shoppingCart {
      display: flex;
      flex-direction: column;
      align-items: center;

      border-radius: 20px;

      width: 100%;
      max-width: 500px;

      padding: 20px;

      box-shadow: 0 3px 5px -1px rgba(#000, 0.5);

      .shoppingCart-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        margin-bottom: 10px;
      }

      .shoppingCart-item {
        display: flex;
        align-items: center;

        width: 100%;

        padding: 10px 0;
        border-bottom: 0.5px solid rgba(#000, 0.15);

        h2 {
          padding: 0 4px;
        }
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }

      h2 {
        flex: 2;
      }
      .shoppingCart-actions {
        flex: 1;
        .md-icon-button {
        }
        h3 {
          padding: 0 10px;
        }
      }
      .price {
        flex: 2;
        text-align: right;
      }
      .checkout {
        margin-top: 20px;
        align-self: flex-end;
      }
    }
  }
}

.order-electron {
  display: flex;
  height: 100%;

  .product-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    row-gap: 30px;
    column-gap: 30px;

    width: 70%;

    padding: 40px;

    box-shadow: 1px 0 40px rgba(#000, 0.1);

    overflow-y: scroll;

    .product:last-child {
      margin-bottom: 30px;
    }
  }

  .shoppingCart-container {
    display: flex;
    flex-direction: column;

    position: relative;

    width: 30%;
    height: 100%;

    padding: 30px;

    .shoppingCart {
      box-shadow: none;
      background-color: transparent;
      margin-top: 20px;

      height: 100%;

      .shoppingCart-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-bottom: 40px;
        h1 {
          font-size: 2.5em;
        }
      }

      .shoppingCart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 20px 0;
        border-bottom: 0.5px solid rgba(#000, 0.15);

        img {
          width: 50px;
          height: 50px;

          border-radius: 50%;
        }

        h3 {
          padding: 0 10px;
        }
      }

      .checkout {
        position: absolute;
        top: auto;
        bottom: 10px;

        width: 100%;
        height: 50px;
      }
    }
  }
}

.checkout-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  background-color: rgba(#000, 0.5);

  width: 100%;
  height: 100%;

  z-index: 10001;

  .checkout {
    display: flex;
    flex-direction: column;
    align-items: center;

    border-radius: 20px;

    margin-bottom: 15px;

    width: 100%;
    max-width: 500px;

    padding: 20px;

    box-shadow: 0 3px 5px -1px rgba(#000, 0.5);

    .checkout-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;

      width: 100%;
      margin-bottom: 10px;
    }

    img {
      display: block;

      width: calc(50% - 32px);
      max-height: 370px;
    }

    .total {
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 600px) {
  .shoppingCart-container {
    .shoppingCart-actions {
      .md-icon-button {
        // display: none;
      }
    }
    .price {
      flex: 3 !important;
    }
  }
}
</style>
