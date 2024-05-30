cmake_minimum_required(VERSION 3.10)

# Set the project name and version
project(Qiraa VERSION 1.0)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the executable
add_executable(Qiraa main.cpp)

# Include directories for nlohmann/json and SQLiteCpp
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/lib/SQLiteCpp/include)

# Find the SQLite3 package
find_package(SQLite3 REQUIRED)

# Add nlohmann/json as a dependency
# Assuming you have it in the include directory
include_directories(${CMAKE_SOURCE_DIR}/include/single_include/nlohmann/)

# Link libraries
target_link_libraries(Qiraa 
    SQLiteCpp 
    sqlite3 
    pthread)
link_directories(${CMAKE_SOURCE_DIR}/lib/SQLiteCpp/build)
