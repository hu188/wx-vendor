Component({
  properties: {
    count: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 0
    },
    discount: {
      type: Number,
      value: 0
    },
  },
  methods: {
    onSubmit(ev) {
      this.triggerEvent('onSubmit')
    },
  }
})