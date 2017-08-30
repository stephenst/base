(function () {
    'use strict';

    var missionsites = {
        "sites": [
            {
                "name": "Group W",
                "location": [38.882501, -77.227027]
            },
            {
                "name": "Bermuda",
                "location": [32.326143, -64.742977]
            },
            {"name": "Albany, N.Y.", "location": [42.6666666666667, -73.75]},
            {"name": "Albuquerque, N.M.", "location": [35.0833333333333, -106.65]},
            {"name": "Amarillo, Tex.", "location": [35.1833333333333, -101.833333333333]},
            {"name": "Anchorage, Alaska", "location": [61.2166666666667, -149.9]},
            {"name": "Atlanta, Ga.", "location": [33.75, -84.3833333333333]},
            {"name": "Austin, Tex.", "location": [30.2666666666667, -97.7333333333333]},
            {"name": "Baker, Ore.", "location": [44.7833333333333, -117.833333333333]},
            {"name": "Baltimore, Md.", "location": [39.3, -76.6333333333333]},
            {"name": "Bangor, Maine", "location": [44.8, -68.7833333333333]},
            {"name": "Birmingham, Ala.", "location": [33.5, -86.8333333333333]},
            {"name": "Bismarck, N.D.", "location": [46.8, -100.783333333333]},
            {"name": "Boise, Idaho", "location": [43.6, -116.216666666667]},
            {"name": "Boston, Mass.", "location": [42.35, -71.0833333333333]},
            {"name": "Buffalo, N.Y.", "location": [42.9166666666667, -78.8333333333333]},
            {"name": "Calgary, Alba., Can.", "location": [51.0166666666667, -114.016666666667]},
            {"name": "Carlsbad, N.M.", "location": [32.4333333333333, -104.25]},
            {"name": "Charleston, S.C.", "location": [32.7833333333333, -79.9333333333333]},
            {"name": "Charleston, W. Va.", "location": [38.35, -81.6333333333333]},
            {"name": "Charlotte, N.C.", "location": [35.2333333333333, -80.8333333333333]},
            {"name": "Cheyenne, Wyo.", "location": [41.15, -104.866666666667]},
            {"name": "Chicago, Ill.", "location": [41.8333333333333, -87.6166666666667]},
            {"name": "Cincinnati, Ohio", "location": [39.1333333333333, -84.5]},
            {"name": "Cleveland, Ohio", "location": [41.4666666666667, -81.6166666666667]},
            {"name": "Columbia, S.C.", "location": [34, -81.0333333333333]},
            {"name": "Columbus, Ohio", "location": [40, -83.0166666666667]},
            {"name": "Dallas, Tex.", "location": [32.7666666666667, -96.7666666666667]},
            {"name": "Denver, Colo.", "location": [39.75, -105]},
            {"name": "Des Moines, Iowa", "location": [41.5833333333333, -93.6166666666667]},
            {"name": "Detroit, Mich.", "location": [42.3333333333333, -83.05]},
            {"name": "Dubuque, Iowa", "location": [42.5166666666667, -90.6666666666667]},
            {"name": "Duluth, Minn.", "location": [46.8166666666667, -92.0833333333333]},
            {"name": "Eastport, Maine", "location": [44.9, -67]},
            {"name": "Edmonton, Alb., Can.", "location": [53.5666666666667, -113.466666666667]},
            {"name": "El Centro, Calif.", "location": [32.6333333333333, -115.55]},
            {"name": "El Paso, Tex.", "location": [31.7666666666667, -106.483333333333]},
            {"name": "Eugene, Ore.", "location": [44.05, -123.083333333333]},
            {"name": "Fargo, N.D.", "location": [46.8666666666667, -96.8]},
            {"name": "Flagstaff, Ariz.", "location": [35.2166666666667, -111.683333333333]},
            {"name": "Fort Worth, Tex.", "location": [32.7166666666667, -97.3166666666667]},
            {"name": "Fresno, Calif.", "location": [36.7333333333333, -119.8]},
            {"name": "Grand Junction, Colo.", "location": [39.0833333333333, -108.55]},
            {"name": "Grand Rapids, Mich.", "location": [42.9666666666667, -85.6666666666667]},
            {"name": "Havre, Mont.", "location": [48.55, -109.716666666667]},
            {"name": "Helena, Mont.", "location": [46.5833333333333, -112.033333333333]},
            {"name": "Honolulu, Hawaii", "location": [21.3, -157.833333333333]},
            {"name": "Hot Springs, Ark.", "location": [34.5166666666667, -93.05]},
            {"name": "Houston, Tex.", "location": [29.75, -95.35]},
            {"name": "Idaho Falls, Idaho", "location": [43.5, -112.016666666667]},
            {"name": "Indianapolis, Ind.", "location": [39.7666666666667, -86.1666666666667]},
            {"name": "Jackson, Miss.", "location": [32.3333333333333, -90.2]},
            {"name": "Jacksonville, Fla.", "location": [30.3666666666667, -81.6666666666667]},
            {"name": "Juneau, Alaska", "location": [58.3, -134.4]},
            {"name": "Kansas City, Mo.", "location": [39.1, -94.5833333333333]},
            {"name": "Key West, Fla.", "location": [24.55, -81.8]},
            {"name": "Kingston, Ont., Can.", "location": [44.25, -76.5]},
            {"name": "Klamath Falls, Ore.", "location": [42.1666666666667, -121.733333333333]},
            {"name": "Knoxville, Tenn.", "location": [35.95, -83.9333333333333]},
            {"name": "Las Vegas, Nev.", "location": [36.1666666666667, -115.2]},
            {"name": "Lewiston, Idaho", "location": [46.4, -117.033333333333]},
            {"name": "Lincoln, Neb.", "location": [40.8333333333333, -96.6666666666667]},
            {"name": "London, Ont., Can.", "location": [43.0333333333333, -81.5666666666667]},
            {"name": "Long Beach, Calif.", "location": [33.7666666666667, -118.183333333333]},
            {"name": "Los Angeles, Calif.", "location": [34.05, -118.25]},
            {"name": "Louisville, Ky.", "location": [38.25, -85.7666666666667]},
            {"name": "Manchester, N.H.", "location": [43, -71.5]},
            {"name": "Memphis, Tenn.", "location": [35.15, -90.05]},
            {"name": "Miami, Fla.", "location": [25.7666666666667, -80.2]},
            {"name": "Milwaukee, Wis.", "location": [43.0333333333333, -87.9166666666667]},
            {"name": "Minneapolis, Minn.", "location": [44.9833333333333, -93.2333333333333]},
            {"name": "Mobile, Ala.", "location": [30.7, -88.05]},
            {"name": "Montgomery, Ala.", "location": [32.35, -86.3]},
            {"name": "Montpelier, Vt.", "location": [44.25, -72.5333333333333]},
            {"name": "Montreal, Que., Can.", "location": [45.5, -73.5833333333333]},
            {"name": "Moose Jaw, Sask., Can.", "location": [50.6166666666667, -105.516666666667]},
            {"name": "Nashville, Tenn.", "location": [36.1666666666667, -86.7833333333333]},
            {"name": "Nelson, B.C., Can.", "location": [49.5, -117.283333333333]},
            {"name": "Newark, N.J.", "location": [40.7333333333333, -74.1666666666667]},
            {"name": "New Haven, Conn.", "location": [41.3166666666667, -72.9166666666667]},
            {"name": "New Orleans, La.", "location": [29.95, -90.0666666666667]},
            {"name": "New York, N.Y.", "location": [40.7833333333333, -73.9666666666667]},
            {"name": "Nome, Alaska", "location": [64.4166666666667, -165.5]},
            {"name": "Oakland, Calif.", "location": [37.8, -122.266666666667]},
            {"name": "Oklahoma City, Okla.", "location": [35.4333333333333, -97.4666666666667]},
            {"name": "Omaha, Neb.", "location": [41.25, -95.9333333333333]},
            {"name": "Ottawa, Ont., Can.", "location": [45.4, -75.7166666666667]},
            {"name": "Philadelphia, Pa.", "location": [39.95, -75.1666666666667]},
            {"name": "Phoenix, Ariz.", "location": [33.4833333333333, -112.066666666667]},
            {"name": "Pierre, S.D.", "location": [44.3666666666667, -100.35]},
            {"name": "Pittsburgh, Pa.", "location": [40.45, -79.95]},
            {"name": "Portland, Maine", "location": [43.6666666666667, -70.25]},
            {"name": "Portland, Ore.", "location": [45.5166666666667, -122.683333333333]},
            {"name": "Providence, R.I.", "location": [41.8333333333333, -71.4]},
            {"name": "Quebec, Que., Can.", "location": [46.8166666666667, -71.1833333333333]},
            {"name": "Raleigh, N.C.", "location": [35.7666666666667, -78.65]},
            {"name": "Reno, Nev.", "location": [39.5, -119.816666666667]},
            {"name": "Richfield, Utah", "location": [38.7666666666667, -112.083333333333]},
            {"name": "Richmond, Va.", "location": [37.55, -77.4833333333333]},
            {"name": "Roanoke, Va.", "location": [37.2833333333333, -79.95]},
            {"name": "Sacramento, Calif.", "location": [38.5833333333333, -121.5]},
            {"name": "St. John, N.B., Can.", "location": [45.3, -66.1666666666667]},
            {"name": "St. Louis, Mo.", "location": [38.5833333333333, -90.2]},
            {"name": "Salt Lake City, Utah", "location": [40.7666666666667, -111.9]},
            {"name": "San Antonio, Tex.", "location": [29.3833333333333, -98.55]},
            {"name": "San Diego, Calif.", "location": [32.7, -117.166666666667]},
            {"name": "San Francisco, Calif.", "location": [37.7833333333333, -122.433333333333]},
            {"name": "San Jose, Calif.", "location": [37.3333333333333, -121.883333333333]},
            {"name": "San Juan, P.R.", "location": [18.5, -66.1666666666667]},
            {"name": "Santa Fe, N.M.", "location": [35.6833333333333, -105.95]},
            {"name": "Savannah, Ga.", "location": [32.0833333333333, -81.0833333333333]},
            {"name": "Seattle, Wash.", "location": [47.6166666666667, -122.333333333333]},
            {"name": "Shreveport, La.", "location": [32.4666666666667, -93.7]},
            {"name": "Sioux Falls, S.D.", "location": [43.55, -96.7333333333333]},
            {"name": "Sitka, Alaska", "location": [57.1666666666667, -135.25]},
            {"name": "Spokane, Wash.", "location": [47.6666666666667, -117.433333333333]},
            {"name": "Springfield, Ill.", "location": [39.8, -89.6333333333333]},
            {"name": "Springfield, Mass.", "location": [42.1, -72.5666666666667]},
            {"name": "Springfield, Mo.", "location": [37.2166666666667, -93.2833333333333]},
            {"name": "Syracuse, N.Y.", "location": [43.0333333333333, -76.1333333333333]},
            {"name": "Tampa, Fla.", "location": [27.95, -82.45]},
            {"name": "Toledo, Ohio", "location": [41.65, -83.55]},
            {"name": "Toronto, Ont., Can.", "location": [43.6666666666667, -79.4]},
            {"name": "Tulsa, Okla.", "location": [36.15, -95.9833333333333]},
            {"name": "Vancouver, B.C., Can.", "location": [49.2166666666667, -123.1]},
            {"name": "Victoria, B.C., Can.", "location": [48.4166666666667, -123.35]},
            {"name": "Virginia Beach, Va.", "location": [36.85, -75.9666666666667]},
            {"name": "Washington, D.C.", "location": [38.8833333333333, -77.0333333333333]},
            {"name": "Wichita, Kan.", "location": [37.7166666666667, -97.2833333333333]},
            {"name": "Wilmington, N.C.", "location": [34.2333333333333, -77.95]},
            {"name": "Winnipeg, Man., Can.", "location": [49.9, -97.1166666666667]}
        ]
    };

    var riskareas = {
        "name": "METAL Sample Threat Areas",
        "areas": [
            {
                "id": "Virginia Eastern Shore",
                "name": "Virginia Eastern Shore",
                "level": "land",
                "verteces": [
                    [37.964590, -75.653528],
                    [38.018704, -75.233301],
                    [37.183113, -75.821069],
                    [37.082387, -75.966638],
                    [37.323029, -76.043542],
                    [37.604257, -75.941919]
                ]
            },
            {
                "id": "Submarines 1",
                "name": "Submarines 1",
                "level": "medium",
                "verteces": [
                    [37, -75],
                    [37, -74],
                    [36, -74],
                    [36, -75]
                ]
            },
            {
                "id": "Submarines 2",
                "name": "Submarines 2",
                "level": "medium",
                "verteces": [
                    [32, -79],
                    [32, -78],
                    [31, -78],
                    [31, -79]
                ]
            },
            {
                "id": "Corolla CDCM",
                "name": "Corolla CDCM",
                "level": "high",
                "verteces": [
                    [36.373004, -75.825724],
                    [36.985360, -75.985026],
                    [36.950248, -75.584025],
                    [36.791400, -75.226043]
                ]
            },
            {
                "id": "Bermuda Triangle",
                "name": "Bermuda Triangle",
                "level": "low",
                "verteces": [
                    [32.206207, -64.902568],
                    [25.588242, -79.927416],
                    [17.721602, -65.117900]
                ]
            }
        ]
    };

    var routes = {
        "name": "METAL Sample Routes",
        "routes": [
            {
                "name": "Baltimore to Bermuda",
                "waypoints": [
                    [39.259170, -76.560407],
                    [39.167157, -76.379850],
                    [38.536355, -76.434567],
                    [38.252206, -76.258786],
                    [37.371914, -76.187984],
                    [37.048173, -76.058895],
                    [32.326143, -64.742977]
                ]
            },
            {
                "name": "Kent Island to Group W",
                "waypoints": [
                    [38.985896, -76.33209],
                    [39.027540, -76.448514],
                    [38.882501, -77.227027]
                ]
            }
        ]
    };

    var metaldata = {
        "name": "METAL Sample Scenario",
        "sites": [
            {
                "name": "Baltimore",
                "location": [
                    39.259170,
                    -76.560407
                ],
                "risk": {"type": "safe"},
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
                    "type": "forward",
                    "transition": {
                        "C to U": 0.3,
                        "U to C": 0.5
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
                    "type": "forward",
                    "transition": {
                        "C to U": 0.3,
                        "U to C": 0.5
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
                    "type": "forward",
                    "transition": {
                        "C to U": 0.3,
                        "U to C": 0.5
                    }
                },
                "needed_asset_types": [
                    "mission"
                ]
            }
        ]
    };

    angular
        .module('metal')
        .constant('metaldata', metaldata)
        .constant('missionsites', missionsites)
        .constant('riskareas', riskareas)
        .constant('routes', routes);

})();

