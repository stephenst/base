var metaldata =
{
  "name": "METAL Sample Scenario",
  "sites": [
    {
      "name": "Baltimore",
      "location": [
        39.259170,
        -76.560407
      ],
      "risk": {"type":"safe"},
      "needed_asset_types": [
        "port"
      ]
    },
    {
      "name": "Kent Island",
      "location": [
        38.985896,
        -76.332097
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    },
    {
      "name": "Rock Hall",
      "location": [
        39.140243,
        -76.259999
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    },
    {
      "name": "Betterton",
      "location": [
        39.370465,
        -76.063962
      ],
      "risk": {
        "type":"forward",
        "transition": {
          "C to U":0.3,
          "U to C":0.5
        }
      },
      "needed_asset_types": [
        "mission"
      ]
    }
  ]
}
