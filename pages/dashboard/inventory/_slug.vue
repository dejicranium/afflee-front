<template>
  <div class="container">
      <InventoryItemPreviewModal
        edit_mode="true"
        v-if="item_in_view"
        :product="item_in_view"
        :marketer="inventory.details.marketer"
       @close="item_in_view = null"/>
    
    <div class="details" v-if="inventory && inventory.details">
        <div class="form-input">
            <label>Name</label>
            <input type="text" v-model="inventory.details.name">
        </div>
        <div class="form-input">
            <label>Description</label>
            <input type="text"   v-model="inventory.details.description">
        </div>

        
    </div>
    <div class="form">
        <div class="inventory">
          <div
            class="inventory__item"
            v-for="(item, i) in inventory.items"
            :key="i"
            @click="show_modal = true; item_in_view = item.product"
          >
            <div class="inventory__item__picture">
              <img :src="item.product.thumbnail" alt />
            </div>
            <p class="inventyr__item__label"></p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    layout: 'dashboard',
    data() {
        return {
            inventory: {
                items: [],
                details: null
            },
            item_in_view: null
        }
    },
    created() {
        this.getItems()
    },
    methods: {
        getItems(){
            this.$api.get(`/inventory/${this.$route.params.slug}`).then(resp=>{
                this.inventory.items = resp.data.data.list;
                this.inventory.details = resp.data.data.details
            })
        },
        previewItem(item){
            this.item_in_view =item
        },
    }
}
</script>

<style lang="scss" scoped>
.container{
    background: white;
}
.details {
    width: 50%;
    padding: 16px;
    @include media("<=t") {
        width: 90%;
        margin: auto;
    }
    h1 {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
    }
}

.empty {
    width: 100%;
    text-align: center;
}
.navbar {
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: center;
}

.form {
    background: white;
    width: 50%;
    @include media("<=t") {
        width: 100%;
    }
}
.footer {
    width: 100%;
    button {
        @include smallbutton;
        width: 100%;
        padding: 16px 8px;
    }
}

.main {
    border: 1.5px solid whitesmoke;
    border-left: 0;
    border-right: 0;
    //ht: 70vh;
    overflow: scroll;
    background: white;

}

.inventory {
    padding: 8px;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    justify-content: space-between;

    &__item {
        //border: 3px solid whitesmoke;
        width: 100%;
        height: 200px;
        margin-bottom: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        color: lightgrey;
        cursor: pointer;

        &:hover {
            background: whitesmoke;
            filter: grayscale(1);
        }

        &__picture {
            width: 100%;
            height: 100%;
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }
    }

}

.form-input {
    @include plain-form-input;
    input {
        background: white;
    }
}

</style>