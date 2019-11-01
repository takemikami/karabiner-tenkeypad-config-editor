'use strict';

// [START gae_node_request_example]
const express = require('express');
const morgan = require('morgan');

const index = express();

index.use(morgan("dev", { format: 'dev', immediate: true }));
index.use(express.static('public'));

const options = [
  {
    title: '虫めがね (/)',
    to: {
      "key_code": "/"
    }
  },
  {
    title: '手のひらツール (Space)',
    to: {
      "key_code": "spacebar"
    }
  },
  {
    title: '選択範囲 (M)',
    to: {
      "key_code": "m"
    }
  },
  {
    title: '自動選択 (W)',
    to: {
      "key_code": "w"
    }
  },
  {
    title: 'スポイト (I)',
    to: {
      "key_code": "i"
    }
  },
  {
    title: 'ペン (P)',
    to: {
      "key_code": "p"
    }
  },
  {
    title: 'ブラシ (B)',
    to: {
      "key_code": "b"
    }
  },
  {
    title: '消しゴム (E)',
    to: {
      "key_code": "e"
    }
  },
  {
    title: '色混ぜ (J)',
    to: {
      "key_code": "j"
    }
  },
  {
    title: '塗りつぶし (G)',
    to: {
      "key_code": "g"
    }
  },
  {
    title: 'ペン先切替上 (,)',
    to: {
      "key_code": "comma"
    }
  },
  {
    title: 'ペン先切替下 (.)',
    to: {
      "key_code": "period"
    }
  },
  {
    title: '取り消し (Cmd+Z)',
    to: {
      "key_code": "z",
      "modifiers": [
        "command"
      ]
    }
  },
  {
    title: 'やり直し (Cmd+Y)',
    to: {
      "key_code": "y",
      "modifiers": [
        "command"
      ]
    }
  },
  {
    title: 'レイヤー移動上 (Opt+[)',
    to: {
      "key_code": "backslash",
      "modifiers": [
        "option"
      ]
    }
  },
  {
    title: 'レイヤー移動下 (Opt+])',
    to: {
      "key_code": "close_bracket",
      "modifiers": [
        "option"
      ]
    }
  }
]


index.get('/api/import', (req, res) => {
  var mappings = {};
  var vendorId = "";
  var productId = "";
  for(var k in req.query) {
    if (k == "vendorId") {
      vendorId = parseInt(req.query[k]);
    } else if (k == "productId") {
      productId = parseInt(req.query[k]);
    } else {
      mappings[k] = req.query[k]
    }
  }

  var manipulators = [];
  var idx = 0;
  for (var m in mappings) {
    manipulators[idx] = {
      "type": "basic",
      "from": {
        "key_code": m
      },
      "to": options[mappings[m]].to
    };
    if(vendorId != "" && productId != "") {
      manipulators[idx]["conditions"] = [
        {
          "type": "device_if",
          "identifiers": [
            {
              "vendor_id": vendorId,
              "product_id": productId
            }
          ]
        }
      ];
    }
    idx++;
  }
  var json = {
    "title": "Karabinerテンキーパッド設定エディタによる設定",
    "rules": [
      {
        "description": "CLIP STUDIO PAINT用テンキー設定",
        "manipulators": manipulators
      }
    ]
  };

  res
  .status(200)
  .json(json)
  .end();
});

index.get('/api/options', (req, res) => {
  res
  .status(200)
  .json(options)
  .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
index.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = index;