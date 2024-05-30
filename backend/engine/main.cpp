#include <iostream>
#include <fstream>
#include <json.hpp>
#include <SQLiteCpp/SQLiteCpp.h>
#include <SQLiteCpp/VariadicBind.h> // Optional for variadic bind

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
    std::vector<std::pair<std::string, int>>
        bufferedData;
    for (const auto &item : jsonData)
    {
        std::string Author = item["Author"];
        int ID = item["Book Id"];
        bufferedData.emplace_back(Author, ID);
    }

    // Open SQLite database
    SQLite::Database db("test.db", SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);

    // Create a table if it doesn't exist
    db.exec("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, name TEXT, PID INTEGER)");

    // Insert buffered data into the table
    SQLite::Statement query(db, "INSERT INTO people (name, PID) VALUES (?, ?)");
    for (const auto &[Author, ID] : bufferedData)
    {
        query.bind(1, Author);
        query.bind(2, ID);
        query.exec();
        query.reset();
    }

    std::cout << "Data successfully written to the SQLite database " << std::endl;

    return 0;
}

// let arr = [
//     'id', "Book Id",
//     'title', "Title",
//     'pathbook', "Function to create file",
//     'pagesCount', "Number of Pages",
//     'pubDate', "Year Published",
//     'Publisher', "Publisher",
//     'rating', "My Rating",
//     'authorName', "Author", "Additional Authors",
//     'tags', "[Bookshelves]",
//     'comments', "My Review"
// ]
