<style lang="scss">

</style>
<template>

  
</template>
<script>

  import localValidatorMixin from 'adminUI/helpers/local-validator-mixin'
  import standardFormApiMixin from 'adminUI/helpers/standard-form-api-mixin'
  import AdIcon from 'adminUI/components/admin-icon'
  export default {
    name: 'ad-input',
    mounted () {
      let vm = this
      window.document.addEventListener('click', function adAssociationsHide () {
        vm.associationsShow = false
      })
    },
    destroyed () {
      window.document.removeEventListener('click', 'adAssociationsHide')
    },
    data () {
      return {
        // is the throttlling on
        throttlling: true,
        associationsShow: false
      }
    },
    mixins: [localValidatorMixin, standardFormApiMixin],
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      associations: Array,
      icon: String
    },
    components: {
      AdIcon
    },
    watch: {
      associations (v) {
        this.toggleAssociations(!!v.length)
      }
    },
    methods: {
      keyup (e) { this.$emit('keyup', e.target.value, e) },
      keypress (e) { this.$emit('keypress', e.target.value, e) },
      keydown (e) { this.$emit('keydown', e.target.value, e) },
      click (e) {
        this.$emit('click', e.target.value, e)
      },
      labelClick () {
        this.$refs.core.focus()
      },
      toggleAssociations (v) {
        if (v) this.associationsShow = !!this.associations
        else this.associationsShow = false
      },
      selectAssociation (rec) {
        this.localValue = rec.text
        this.toggleAssociations(false)
        this.$emit('toggle-select', rec)
        this.input()

      }
    }
  }
</script>