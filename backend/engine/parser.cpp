#include <iostream>
#include <fstream>
#include <vector>
#include <utility>
#include "./nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

int main(int argc, char *argv[])
{
    // Open and read the JSON file
    std::ifstream jsonFile("example.json");
    if (!jsonFile.is_open())
    {
        std::cerr << "Failed to open the JSON file" << std::endl;
        return 1;
    }

    // Parse the JSON file
    json jsonData;
    jsonFile >> jsonData;

    // Close the JSON file
    jsonFile.close();

    // Buffer some data from the JSON
    // Assuming the JSON structure contains an array of objects with 'name' and 'age' fields
    std::vector<std::pair<std::string, int>> bufferedData;
    for (const auto &item : jsonData)
    {
        std::string Author = item["Author"];
        int rating = item["Average Rating"];
        bufferedData.emplace_back(Author, rating);
    }
    // ... (Proceed to write data to SQLite database)
    
    return 0;
}