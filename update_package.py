import json

with open("old_prod_version.json", "r") as jsonFile:
    dataVersion = json.load(jsonFile)

with open("package.json", "r+") as jsonFile:
    data = json.load(jsonFile)

    data["name"] = "eco-atl-dci"
    data["version"] = dataVersion["version"]

    jsonFile.seek(0)  # rewind
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
