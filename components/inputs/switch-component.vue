<template>
  <!-- Rounded switch -->
  <label class="switch">
    <input
      :checked="checked"
      v-if="local_checked === true"
      type="checkbox"
      v-model="local_checked"
      @change="execute(false)"
    />
    <input :checked="checked" v-else type="checkbox" @change="execute(true)" />
    <span class="slider round"></span>
  </label>
</template>

<script>
export default {
  props: ["checked"],
  data() {
    return {
      local_checked: null
    };
  },
  watch: {
    checked(value) {
      this.local_checked = this.value;
    }
  },
  created() {
    this.local_checked = this.checked;
  },
  methods: {
    execute(state) {
      this.$emit("execute", state);
    }
  }
};
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: lightseagreen;
}

input:focus + .slider {
  box-shadow: 0 0 1px $lightaccent;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>