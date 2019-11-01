var app = new Vue({
  el: '#app',
  mounted: function() {
    this.$http.get('/api/options').then(response => {
      this.options = response.body;
      if (localStorage.mappings) {
        var keepMappings = JSON.parse(localStorage.mappings);
        for(var k in keepMappings) {
          for(var o in this.options) {
            if(keepMappings[k] == this.options[o]["title"]) {
              this.mappings[k] = o;
              break;
            }
          }
        }
      }
    }, response => {
      console.log(response.body);
    });
    if (localStorage.vendorId) {
      this.vendorId = localStorage.vendorId;
    }
    if (localStorage.productId) {
      this.productId = localStorage.productId;
    }
  },
  methods: {
    copyJson: function() {
      navigator.clipboard.writeText(this.configJson);
    },
    downloadJson: function() {
      let blob = new Blob([this.configJson], { type: 'text/json' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'karabiner-tenkeypad-config.json'
      link.click()
    },
    importJson: function() {
      var paramStr = [];
      if(new String(this.vendorId).length > 0) {
        paramStr.push("vendorId=" + this.vendorId);
      }
      if(new String(this.productId).length > 0) {
        paramStr.push("productId="+ this.productId);
      }
      for(var k in this.mappings) {
        if (this.mappings[k] != -1) {
          paramStr.push(k + "=" + this.mappings[k]);
        }
      }
      const params = paramStr.join("&");
      const link = document.createElement('a')
      const url = window.location.protocol + "//" + window.location.host + "/api/import";
      link.href = "karabiner://karabiner/assets/complex_modifications/import?url=" + encodeURIComponent(url + "?" + params);
      link.click()
    },
    persist: function() {
      localStorage.vendorId = this.vendorId;
      localStorage.productId = this.productId;
      var keepMappings = {};
      for(var k in this.mappings) {
        if (this.mappings[k] != -1) {
          keepMappings[k] = this.options[this.mappings[k]]['title'];
        }
      }
      localStorage.mappings = JSON.stringify(keepMappings); // https://jp.vuejs.org/v2/cookbook/client-side-storage.html
    }
  },
  computed: {
    configJson: function() {
      var manipulators = [];
      var idx = 0;
      for (var m in this.mappings) {
        if (this.mappings[m] == -1) continue;
        manipulators[idx] = {
          "type": "basic",
          "from": {
            "key_code": m
          },
          "to": this.options[this.mappings[m]].to
        };
        if(this.vendorId != "" && this.productId != "") {
          manipulators[idx]["conditions"] = [
            {
              "type": "device_if",
              "identifiers": [
                {
                  "vendor_id": this.vendorId,
                  "product_id": this.productId
                }
              ]
            }
          ];
        }
        idx++;
      };
      var json = {
        "title": "Karabinerテンキーパッド設定エディタによる設定",
        "rules": [
          {
            "description": "CLIP STUDIO PAINT用テンキー設定",
            "manipulators": manipulators
          }
        ]
      };
      return JSON.stringify(json, null, "\t");
    }
  },
  data: {
    vendorId: '',
    productId: '',
    mappings: {
      keypad_num_lock: -1,
      keypad_slash: -1,
      keypad_asterisk: -1,
      keypad_hyphen: -1,
      keypad_hyphen: -1,
      keypad_plus: -1,
      keypad_enter: -1,
      keypad_1: -1,
      keypad_2: -1,
      keypad_3: -1,
      keypad_4: -1,
      keypad_5: -1,
      keypad_6: -1,
      keypad_7: -1,
      keypad_8: -1,
      keypad_9: -1,
      keypad_0: -1,
      keypad_period: -1,
      keypad_equal_sign: -1,
      keypad_comma: -1,
      tab: -1,
      delete_or_backspace: -1,
    },
    options: []
  }
})
