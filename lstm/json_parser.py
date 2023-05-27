import datetime
import json


def parser(json_data, pediod='MINUTE'): #  takes python dict as input

    def timestamp_to_iso(timestamp):
        return datetime.datetime.utcfromtimestamp(timestamp / 1000).isoformat()

    # Parse and restructure the JSON
    output_data = []
    json_data = [json_data]
    for item in json_data[0]:
        print(item)
        entry = {
            pediod: {
                "prices": [
                    {
                        "snapshotTime": timestamp_to_iso(item["snapshotTimeUTC"]),
                        "snapshotTimeUTC": timestamp_to_iso(item["snapshotTimeUTC"]),
                        "openPrice": {
                            "bid": item["prices"][0]["openPricebid"],
                            "ask": item["prices"][0]["openPriceask"]
                        },
                        "closePrice": {
                            "bid": item["prices"][0]["closePricebid"],
                            "ask": item["prices"][0]["closePriceask"]
                        },
                        "highPrice": {
                            "bid": item["prices"][0]["highPricebid"],
                            "ask": item["prices"][0]["highPriceask"]
                        },
                        "lowPrice": {
                            "bid": item["prices"][0]["lowPricebid"],
                            "ask": item["prices"][0]["lowPriceask"]
                        },
                        "lastTradedVolume": item["lastTradedVolume"]
                    }
                ]
            }
        }
        output_data.append(entry)
        return output_data[0]

