import json
import sys

print(sys.argv)

with open("old_prod_version.json", "r+") as jsonFile:
    data = json.load(jsonFile)

    data["version"] = sys.argv[1]

    jsonFile.seek(0)  # rewind
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
